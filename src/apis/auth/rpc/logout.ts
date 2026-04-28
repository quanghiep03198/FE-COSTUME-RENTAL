import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { setCookie } from '@tanstack/react-start/server'
import { cookieOptions } from '../configs/cookie.config'
import { authMiddleware } from '../middlewares/auth.middleware'
import { requestMiddleware } from '../middlewares/request.middleware'

export const logOutFn = createServerFn({ method: 'POST' })
  .middleware([authMiddleware, requestMiddleware])
  .handler(async ({ context }) => {
    try {
      await context.request({ url: '/auth/logout', method: 'POST' })
    } finally {
      setCookie('accessToken', '', { ...cookieOptions, maxAge: 0 })
      throw redirect({ to: '/login' })
    }
  })
