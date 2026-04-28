import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '../middlewares/auth.middleware'

export const getProfileRpc = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(({ context }) => {
    console.log('context.user', context.user)
    return context.user
  })
