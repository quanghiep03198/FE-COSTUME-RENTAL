import Footer from '@/components/layouts/public/footer'
import Header from '@/components/layouts/public/header'
import { cn } from '@/lib/utils'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_public-layout')({
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <div className={cn('[--header-top-height:52px] [--header-bottom-height:52px]')}>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}
