import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { setCookie } from '@tanstack/react-start/server'
import { authMiddleware } from '../../../middlewares/auth.middleware'
import { requestMiddleware } from '../../../middlewares/request.middleware'
import { cookieOptions } from '../configs/cookie.config'
import { loginSchema, type TLoginValues } from '../schemas/login.schema'
import type { TLoginResponse } from '../types'

export const loginRpc = createServerFn({ method: 'POST' })
  .middleware([requestMiddleware])
  .inputValidator(loginSchema)
  .handler(async ({ data, context }) => {
    const response = await context.request<TLoginResponse, TLoginValues>({
      url: '/auth/login',
      method: 'POST',
      data,
    })

    setCookie('accessToken', response!.accessToken, cookieOptions)
    return response
  })

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

export const getProfileRpc = createServerFn({ method: 'GET' })
  .middleware([authMiddleware, requestMiddleware])
  .handler(({ context }) => {
    return context.user
    // return context.request({ url: '/auth/me' })
  })
