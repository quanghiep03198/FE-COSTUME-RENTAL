import type { IUser } from '@/apis/user/types'
import request from '@/lib/request'
import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  console.debug('Start checking token from Auth middleware')

  const accessToken = getCookie('accessToken')

  if (!accessToken) throw redirect({ to: '/login' })

  try {
    const user = await request<Nullable<IUser>>({ url: '/auth/me' })
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
