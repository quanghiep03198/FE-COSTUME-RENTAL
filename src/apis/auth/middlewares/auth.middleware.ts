import type { IUser } from '@/apis/user/types'
import request from '@/lib/request'
import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  console.debug('Start checking token from Auth middleware')

  const accessToken = getCookie('accessToken')

  if (!accessToken) throw redirect({ to: '/login' })

  const user = await request<IUser>('/auth/me')

  return next({ context: { accessToken, user } })
})

export const guestMiddleware = createMiddleware({ type: 'request' }).server(async ({ next }) => {
  const accessToken = getCookie('accessToken')

  console.log('accessToken', accessToken)
  if (accessToken) throw redirect({ to: '/statistics' })

  return next({ context: { accessToken } })
})
