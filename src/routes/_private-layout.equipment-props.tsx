import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private-layout/equipment-props')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_private-layout/equipment-props"!</div>
}
