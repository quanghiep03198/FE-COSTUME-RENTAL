import { createIsomorphicFn, createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import z from 'zod'
import { useAuthStore } from '../../../stores/auth.store'
import { authMiddleware } from '../middlewares/auth.middleware'

type CookieSerializeOptions = Parameters<typeof setCookie>[2]

export const cookieOptions: CookieSerializeOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7,
  path: '/',
}

export const getCurrentUserFn = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(({ context }) => {
    try {
      return context
    } catch (error) {
      console.error(error)
      return { accessToken: null, user: null }
    }
  })

export const setCookieTokenFn = createServerFn({ method: 'POST' })
  .inputValidator(z.string().nonempty())
  .handler(async ({ data }) => {
    setCookie('accessToken', data, cookieOptions)
  })

export const getTokenFn = createIsomorphicFn()
  .client(() => {
    console.log('Get token from Zustand')
    return useAuthStore.getState().accessToken
  })
  .server(() => {
    console.log('Get token from Cookie')
    return getCookie('accessToken')
  })

export const setTokenFn = createIsomorphicFn()
  .client((token: string | null) => {
    console.log('Set token from client function')
    useAuthStore.getState().setAccessToken(token)
  })
  .server((token: string | null) => {
    console.log('Set token from server function')
    if (typeof token === 'string') setCookie('accessToken', token, cookieOptions)
    else setCookie('accessToken', '', { ...cookieOptions, maxAge: 0 })
  })

export const getServerTokenFn = createServerFn({ method: 'GET' }).handler(() => {
  return getCookie('accessToken')
})

export const setServerTokenFn = createServerFn({ method: 'POST' })
  .inputValidator(z.string().nonempty())
  .handler(async ({ data }) => {
    setCookie('accessToken', data, cookieOptions)
  })

export const logOutFn = createServerFn({ method: 'POST' })
  .inputValidator(z.void())
  .handler(async () => {
    setCookie('accessToken', '', { ...cookieOptions, maxAge: 0 })
  })
