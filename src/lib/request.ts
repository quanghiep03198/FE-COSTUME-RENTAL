import { cookieOptions } from '@/apis/auth/configs/cookie.config'
import { RequestHeaders } from '@/common/constants/enums'
import { GlobalConfig } from '@/configs/global.config'
import { redirect } from '@tanstack/react-router'
import { getCookie, setCookie } from '@tanstack/react-start/server'

export default async function request<T = any>(input: string | URL | Request, init?: RequestInit) {
  const accessToken = getCookie('accessToken')
  const baseURL = GlobalConfig.BASE_API_URL

  if (!accessToken) return await (await fetch(baseURL + input, init)).json()

  const response = await fetch(baseURL + input, {
    ...init,
    headers: {
      ...init?.headers,
      [RequestHeaders.CONTENT_TYPE]: 'application/json',
      [RequestHeaders.AUTHORIZATION]: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    if (response.status !== 401) {
      setCookie('accessToken', '', { ...cookieOptions, maxAge: 0 })
      throw redirect({ to: '/login' })
    }

    const res = await fetch(baseURL + '/auth/refresh', {
      ...init,
      headers: {
        ...init?.headers,
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
      console.log('refreshToken', refreshToken)
      return await fetch(baseURL + input, {
        headers: {
          [RequestHeaders.CONTENT_TYPE]: 'application/json',
          [RequestHeaders.AUTHORIZATION]: `Bearer ${refreshToken}`,
        },
      })
    }
  }

  const result = await response.json()

  return result as T
}
