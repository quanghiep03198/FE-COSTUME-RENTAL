import type { IUser } from '@/apis/user/types'
import { RequestHeaders } from '@/common/constants/enums'
import { createAxiosInstance } from '@/lib/axios'
import { createMiddleware } from '@tanstack/react-start'
import { type AxiosRequestConfig } from 'axios'

export const requestMiddleware = createMiddleware().server(async ({ next, context }) => {
  const contextWithAuth = context as { user: IUser; accessToken: string } | undefined

  console.log('contextWithAuth', contextWithAuth)
  const instance = createAxiosInstance(contextWithAuth)

  if (contextWithAuth?.accessToken) {
    return await next({
      context: {
        ...contextWithAuth,
        request: <R = any, D = any>(config: AxiosRequestConfig) =>
          instance.request<unknown, R, D>({
            ...config,
            headers: {
              ...config.headers,
              [RequestHeaders.AUTHORIZATION]: `Bearer ${contextWithAuth.accessToken}`,
              // [RequestHeaders.REQUEST_USER]: contextWithAuth.user?.username,
            },
          }),
      },
    })
  }

  return await next({
    context: {
      request: <R = any, D = any>(config: AxiosRequestConfig<D>) => instance.request<unknown, R, D>(config),
    },
  })
})
