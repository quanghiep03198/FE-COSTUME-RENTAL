import { cookieOptions } from '@/apis/auth/configs/cookie.config'
import type { IUser } from '@/apis/user/types'
import request from '@/lib/request'
import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const accessToken = getCookie('accessToken')

  if (!accessToken) throw redirect({ to: '/login' })

  try {
    const user = await request<Nullable<IUser>>({
      url: '/auth/me',
      headers: { authorization: `Bearer ${accessToken}` },
    })

    if (!user) {
      setCookie('accessToken', '', { ...cookieOptions, maxAge: 0 })
      throw redirect({ to: '/login' })
    }

    return await next({ context: { accessToken, user } })
  } catch {
    throw redirect({ to: '/login' })
  }
})

export const guestMiddleware = createMiddleware({ type: 'request' }).server(async ({ next }) => {
  const accessToken = getCookie('accessToken')

  if (accessToken) throw redirect({ to: '/statistics' })

  return next({ context: { accessToken } })
})
