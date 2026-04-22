import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_public-layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Outlet />
    </>
  )
}
