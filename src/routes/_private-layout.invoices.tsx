import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private-layout/invoices')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_private-layout/invoices"!</div>
}
