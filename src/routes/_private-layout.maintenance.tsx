import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private-layout/maintenance')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_private-layout/maintainance"!</div>
}
