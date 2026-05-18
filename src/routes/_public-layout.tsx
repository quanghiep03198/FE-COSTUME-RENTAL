import Header from '@/components/layouts/public/header'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Fragment } from 'react'

export const Route = createFileRoute('/_public-layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Fragment>
      <Header />
      <main>
        <Outlet />
      </main>
    </Fragment>
  )
}
