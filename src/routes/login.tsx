import useAuth from '@/apis/auth/hooks/use-auth-request'
import { guestMiddleware } from '@/apis/auth/middlewares/auth.middleware'
import Login from '@/components/blocks/login'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/login')({
  component: Page,
  server: {
    middleware: [guestMiddleware],
  },
})

function Page() {
  const { isAuthenticated } = useAuth()
  const navigate = Route.useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate({ to: '/statistics' })
  }, [isAuthenticated])

  return <Login />
}
