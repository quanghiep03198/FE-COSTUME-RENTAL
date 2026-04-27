import { getServerTokenFn } from '@/apis/auth/functions'
import useAuth, { useGetAuthUserQuery } from '@/apis/auth/hooks/use-auth-request'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useAsyncEffect } from 'ahooks'
import { useEffect } from 'react'

const AuthGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { accessToken, setProfile } = useAuth()
  const { data } = useGetAuthUserQuery()
  const router = useRouter()
  const getServerToken = useServerFn(getServerTokenFn)
  const { setAccessToken } = useAuth()

  useAsyncEffect(async () => {
    const token = await getServerToken()
    console.log('[auth-guard.tsx] token', token)
    setAccessToken(token!)
  }, [])

  useEffect(() => {
    if (!data) return
    setProfile(data)
  }, [data])

  useEffect(() => {
    if (!accessToken) router.invalidate().finally(() => router.navigate({ to: '/login' }))
  }, [accessToken])

  return children
}

export default AuthGuard
