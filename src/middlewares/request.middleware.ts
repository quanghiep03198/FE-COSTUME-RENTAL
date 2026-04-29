import type { IUser } from '@/apis/user/types'
import request, { type RequestConfig } from '@/lib/request'
import { createMiddleware } from '@tanstack/react-start'

export const requestMiddleware = createMiddleware().server(async ({ next, context }) => {
  const contextWithAuth = context as { user: IUser; accessToken: string } | undefined
  console.log('contextWithAuth.accessToken', contextWithAuth?.accessToken)

  return await next({
    context: {
      ...contextWithAuth,
      request: async <R = any, D = any>(config: RequestConfig<D>) => {
        config.headers ??= {}

        return await request<R>({
          ...config,
          headers: {
            ...config.headers!,
            ...(!!contextWithAuth?.accessToken && {
              authorization: `Bearer ${contextWithAuth.accessToken}`,
            }),
          },
        })
      },
    },
  })
})
