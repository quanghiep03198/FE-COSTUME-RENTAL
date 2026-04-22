import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const accessToken = getCookie('accessToken')
  if (!accessToken) throw redirect({ to: '/login', statusCode: 307 })
  return next({ context: { accessToken } })
})

export const guestMiddleware = createMiddleware({ type: 'request' }).server(
  async ({ next }) => {
    const accessToken = getCookie('accessToken')
    if (accessToken) throw redirect({ to: '/statistics', statusCode: 307 })
    return next({ context: { accessToken } })
  }
)
