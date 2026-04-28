import { createServerFn } from '@tanstack/react-start'

import { setCookie } from '@tanstack/react-start/server'
import { cookieOptions } from '../configs/cookie.config'
import { requestMiddleware } from '../middlewares/request.middleware'
import { loginSchema, type TLoginValues } from '../schemas/login.schema'
import type { TLoginResponse } from '../types'

export const loginRpc = createServerFn({ method: 'POST' })
  .middleware([requestMiddleware])
  .inputValidator(loginSchema)
  .handler(async ({ data, context }) => {
    console.log('ahihi')

    const response = await context.request<TLoginResponse, TLoginValues>({
      url: '/auth/login',
      method: 'POST',
      data,
    })

    setCookie('accessToken', response.accessToken, cookieOptions)
    // TokeCacheManager.set(response.user.username, response.accessToken)
    return response
  })
