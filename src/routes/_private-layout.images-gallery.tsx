import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private-layout/images-gallery')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_private-layout/images-gallery"!</div>
}
