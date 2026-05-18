import Footer from '@/components/layouts/public/footer'
import Header from '@/components/layouts/public/header'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_public-layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col">
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}
