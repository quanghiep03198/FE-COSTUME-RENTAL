import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private-layout/internal-borrowing')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_private-layout/internal-borrowing"!</div>
}
