import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private-layout/statistics')({
  component: RouteComponent,
  ssr: true,
})

function RouteComponent() {
  return <div>Hello "/_layout/statistics"!</div>
}
