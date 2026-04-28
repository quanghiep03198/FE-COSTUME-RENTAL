import { authMiddleware } from '@/apis/auth/middlewares/auth.middleware'
import { requestMiddleware } from '@/apis/auth/middlewares/request.middleware'
import { createServerFn } from '@tanstack/react-start'

export const getCostumeRpc = createServerFn({ method: 'GET' })
  .middleware([authMiddleware, requestMiddleware])
  .handler(async ({ context }) => {})
