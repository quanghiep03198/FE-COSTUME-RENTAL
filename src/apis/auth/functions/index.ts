import { createIsomorphicFn, createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'
import z from 'zod'
import { useAuthStore } from '../stores'

type CookieSerializeOptions = Parameters<typeof setCookie>[2]

export const cookieOptions: CookieSerializeOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7,
  path: '/',
}

export const setCookieTokenFn = createServerFn({ method: 'POST' })
  .inputValidator(z.string().nonempty())
  .handler(async ({ data }) => {
    setCookie('accessToken', data, cookieOptions)
  })

export const getTokenFn = createIsomorphicFn()
  .client(() => {
    return useAuthStore.getState().accessToken
  })
  .server(() => {
    console.log('Get access token from cookie')
    return getCookie('accessToken')
  })

export const setTokenFn = createIsomorphicFn()
  .client((token: string) => {
    useAuthStore.getState().setAccessToken(token)
  })
  .server((token: string) => {
    console.log('token', token)
    setCookie('accessToken', token, cookieOptions)
  })

export const setServerTokenFn = createServerFn({ method: 'POST' })
  .inputValidator(z.string().nonempty())
  .handler(async ({ data }) => {
    setCookie('accessToken', data, cookieOptions)
  })

export const logOutFn = createServerFn({ method: 'POST' }).handler(async () => {
  setCookie('accessToken', '', { ...cookieOptions, maxAge: 0 })
})
