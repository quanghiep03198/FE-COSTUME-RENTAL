import { getServerTokenFn } from '@/apis/auth/functions'
import { guestMiddleware } from '@/apis/auth/middlewares/auth.middleware'
import Login from '@/components/blocks/login'
import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useAsyncEffect } from 'ahooks'

export const Route = createFileRoute('/login')({
  component: Page,
  server: {
    middleware: [guestMiddleware],
  },
})

function Page() {
  const getServerToken = useServerFn(getServerTokenFn)
  // const { isAuthenticated } = useAuth()
  const navigate = Route.useNavigate()

  useAsyncEffect(async () => {
    const token = await getServerToken()
    if (token) navigate({ to: '/statistics' })
  }, [])

  return <Login />
}
