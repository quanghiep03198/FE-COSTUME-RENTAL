import useAuth, { useGetAuthUserQuery } from '@/apis/auth/hooks/use-auth-request'
import { useHydrated, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

const AuthGuard: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { isAuthenticated, setProfile } = useAuth()
  const { data } = useGetAuthUserQuery()
  const router = useRouter()
  const hyderated = useHydrated()

  useEffect(() => {
    if (!data) return
    setProfile(data.user)
  }, [data])

  useEffect(() => {
    if (!hyderated) return
    if (!isAuthenticated) router.invalidate().finally(() => router.navigate({ to: '/login' }))
  }, [isAuthenticated, hyderated])

  return children
}

export default AuthGuard
