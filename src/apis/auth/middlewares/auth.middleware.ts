import type { IUser } from '@/apis/user/types'
import env from '@/lib/utils'
import { redirect } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  console.log('Start checking token from Auth middleware')
  const accessToken = getCookie('accessToken')
  if (!accessToken) throw redirect({ to: '/login', statusCode: 307 })

  async function getCurrentUser(token: string = accessToken!): Promise<IUser | null> {
    return await fetch(`${env('VITE_BASE_API_URL')}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .catch(async (error) => {
        const responseError = error as Response
        if (responseError.status === 401) {
          const refreshtoken = await (
            await fetch(`${env('VITE_BASE_API_URL')}/auth/me`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          ).json()

          return await getCurrentUser(refreshtoken)
        }
        return null
      })
  }

  const user = await getCurrentUser()
  if (!user) throw redirect({ to: '/login', statusCode: 307 })
  console.log(user)
  return next({ context: { accessToken, user } })
})

export const guestMiddleware = createMiddleware({ type: 'request' }).server(async ({ next }) => {
  const accessToken = getCookie('accessToken')
  if (accessToken) throw redirect({ to: '/statistics', statusCode: 307 })
  return next({ context: { accessToken } })
})
