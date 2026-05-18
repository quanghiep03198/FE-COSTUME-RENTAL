import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public-layout/san-pham')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_public-layout/san-pham"!</div>
}
