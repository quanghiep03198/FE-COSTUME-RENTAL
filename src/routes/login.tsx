// import { getServerTokenFn } from '@/apis/auth/functions'
import { guestMiddleware } from '@/apis/auth/middlewares/auth.middleware'
import Login from '@/components/blocks/login'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: Login,
  server: {
    middleware: [guestMiddleware],
  },
})
