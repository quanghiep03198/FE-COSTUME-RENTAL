import type { IUser } from '@/apis/user/types'
import request from '@/lib/request'
import { createMiddleware } from '@tanstack/react-start'

export const requestMiddleware = createMiddleware().server(async ({ next, context }) => {
  const contextWithAuth = context as { user: IUser; accessToken: string } | undefined

  return await next({
    context: {
      ...contextWithAuth,
      request: async ({ url, ...config }: { url: string | URL | Request } & RequestInit) => {
        await request(url, config)
      },
    },
  })
})
