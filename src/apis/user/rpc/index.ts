import { authMiddleware } from '@/apis/auth/middlewares/auth.middleware'
import { requestMiddleware } from '@/apis/auth/middlewares/request.middleware'
import { createServerFn } from '@tanstack/react-start'

export const getUsersRpc = createServerFn({ method: 'GET' })
  .middleware([authMiddleware, requestMiddleware])
  .handler(async ({ context }) => {
    return await context.request({ url: '/users', method: 'GET', params: { _expand: 'employee' } })
  })

export const createUserRpc = createServerFn({ method: 'POST' })
