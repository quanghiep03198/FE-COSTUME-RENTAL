import { cookieOptions } from '@/apis/auth/configs/cookie.config'
import { HttpStatusCode } from '@/common/constants/http-code'
import { notFound, redirect } from '@tanstack/react-router'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import { isNil } from 'lodash-es'
import { join } from 'path'
import { stringify } from 'qs'
import env from './utils'

export type RequestConfig<D = any> = {
  prefix?: string
  url: string | URL | Request
} & Omit<RequestInit, 'body' | 'method' | 'headers'> & {
    method?: RequestMethod
    data?: D
    headers?: RequestHeaders
    params?: Nullable<RequestQuery>
    debug?: boolean
  }

export default async function request<R = any, D = any>({
  prefix = '/api',
  url,
  params,
  headers = {},
  method = 'GET',
  data,
  debug = env('VITE_NODE_ENV') === 'development',
  ...config
}: RequestConfig<D>) {
  try {
    const accessToken = getCookie('accessToken')
    const baseURL = env('VITE_EXTERNAL_API_URL')

    // * If accessToken exists, set the Authorization header
    headers.authorization ??= `Bearer ${accessToken}`

    // * Create the full URL by joining the prefix and the provided URL
    url = join(prefix, url.toString())

    const requestURL = new URL(url.toString(), baseURL)

    if (!isNil(params))
      requestURL.search = stringify(params, {
        addQueryPrefix: true,
        skipNulls: false,
        format: 'RFC1738', // use RFC1738 to encode spaces as '+'
      })

    // * Only set content-type for non-GET requests with a body that is not FormData
    if (!(data instanceof FormData)) headers['content-type'] = 'application/json'

    // * If data is nil, set body to undefined to avoid sending "null" as a string
    const body = isNil(data) ? undefined : data instanceof FormData ? data : JSON.stringify(data)

    const requestConfig: Required<Parameters<typeof fetch>> = [
      requestURL.toString(),
      {
        ...config,
        headers,
        method,
        body,
      },
    ]

    const response = await fetch(...requestConfig)

    if (response.status === HttpStatusCode.NOT_FOUND) throw notFound()

    if (response.status === HttpStatusCode.UNAUTHORIZED) {
      const res = await fetch(baseURL + '/auth/refresh', {
        headers: {
          ...headers,
          'content-type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
      })

      if (!res.ok) {
        setCookie('accessToken', '', { ...cookieOptions, maxAge: 0 })
        throw redirect({ to: '/login' })
      } else {
        const { access_token: refreshToken } = await res.json()
        setCookie('accessToken', refreshToken, cookieOptions)
        const response = await fetch(requestConfig[0], {
          ...requestConfig[1],
          headers: { ...requestConfig[1].headers, authorization: `Bearer ${refreshToken}` },
        })
        const data: Awaited<R> = await response.json()

        return data
      }
    }

    const responseData: Awaited<R> = await response.json()

    return responseData
    // return (result.data as R) ?? (result as R)
  } catch (error) {
    if (debug) console.error('Request error:', error)
    throw error
  }
}
