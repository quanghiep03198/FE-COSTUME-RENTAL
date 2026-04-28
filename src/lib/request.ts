import { cookieOptions } from '@/apis/auth/configs/cookie.config'
import { RequestHeaders } from '@/common/constants/enums'
import { GlobalConfig } from '@/configs/global.config'
import { type Nullable } from '@tanstack/react-form'
import { redirect } from '@tanstack/react-router'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import { stringify } from 'qs'

export type RequestConfig<D = any> = {
  url: string | URL | Request
} & Omit<RequestInit, 'body' | 'method' | 'headers'> & {
    method?: RequestMethod
    data?: D
    headers?: RequestHeaders
    params?: Nullable<RequestQuery>
    withAuth?: boolean
  }

export default async function request<R = any, D = any>({
  url,
  params,
  headers,
  method = 'GET',
  withAuth = false,
  ...config
}: RequestConfig<D>) {
  try {
    const accessToken = getCookie('accessToken')
    const baseURL = GlobalConfig.BASE_API_URL

    console.log('headers.Authorization', headers)

    url = url.toString().startsWith('/') ? url : `/${url}`

    const requestConfig: Parameters<typeof fetch> = [
      baseURL +
        url +
        stringify(params, {
          addQueryPrefix: true,
          skipNulls: false,
          format: 'RFC1738', // use RFC1738 to encode spaces as '+'
        }),
      {
        ...config,
        method,
        body: config?.data ? JSON.stringify(config.data) : undefined,
        headers: {
          ...(headers as unknown as HeadersInit),
          [RequestHeaders.CONTENT_TYPE]: 'application/json',
          [RequestHeaders.AUTHORIZATION]: `Bearer ${accessToken}`,
        },
      },
    ]

    // if (!accessToken) return await (await fetch(...requestConfig)).json()

    const response = await fetch(...requestConfig)

    if (response.status === 401) {
      const res = await fetch(baseURL + '/auth/refresh', {
        headers: {
          ...(headers as unknown as HeadersInit),
          [RequestHeaders.CONTENT_TYPE]: 'application/json',
          [RequestHeaders.AUTHORIZATION]: `Bearer ${accessToken}`,
        },
      })

      if (!res.ok) {
        setCookie('accessToken', '', { ...cookieOptions, maxAge: 0 })
        throw redirect({ to: '/login' })
      } else {
        const { accessToken: refreshToken } = await res.json()
        setCookie('accessToken', refreshToken, cookieOptions)
        const response = await fetch(requestConfig[0], {
          ...requestConfig[1],
          headers: { ...requestConfig[1]!.headers, [RequestHeaders.AUTHORIZATION]: `Bearer ${refreshToken}` },
        })
        const data: Awaited<R> = await response.json()

        return data
      }
    }

    const result = await response.json()

    return result as R
  } catch (error) {
    console.error('Request error:', error)
    return null
  }
}
