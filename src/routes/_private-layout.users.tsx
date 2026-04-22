import { getUsersQueryOptions } from '@/apis/user/hooks/use-user-request'
import UserPage from '@/components/blocks/users'

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private-layout/users')({
  component: UserPage,
  head: () => ({
    meta: [
      { name: 'description', content: 'Quản lý truy cập' },
      { title: 'Quản lý truy cập' },
    ],
  }),
  beforeLoad: async ({ context }) => {
    await context.queryClient.prefetchQuery(getUsersQueryOptions())
  },
})
