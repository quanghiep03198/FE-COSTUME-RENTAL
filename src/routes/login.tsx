// import { getServerTokenFn } from '@/apis/auth/functions'
import Login from '@/components/blocks/login'
import { guestMiddleware } from '@/middlewares/auth.middleware'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: Login,
  server: {
    middleware: [guestMiddleware],
  },
})
