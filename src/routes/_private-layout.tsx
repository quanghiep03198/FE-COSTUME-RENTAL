import { getAuthUserQueryOptions } from '@/apis/auth/hooks/use-auth-request'
import { ErrorBoundaryFallback } from '@/components/errors/error-boundary-fallback'
import AppNavbar from '@/components/layouts/app/app-navbar'
import AppSidebar from '@/components/layouts/app/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import tw from '@/lib/tw'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ErrorBoundary } from 'react-error-boundary'

export const Route = createFileRoute('/_private-layout')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    await context.queryClient.prefetchQuery(getAuthUserQueryOptions())
  },
})

function RouteComponent() {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '20rem',
          '--sidebar-width-mobile': '20rem',
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <LayoutWrapper data-slot="layout-wrapper">
        <AppNavbar />
        <OutletWrapper data-slot="outlet-wrapper">
          <ErrorBoundary
            fallbackRender={({ error, resetErrorBoundary }) => {
              return (
                <ErrorBoundaryFallback
                  error={error as Error}
                  resetError={(args) => {
                    resetErrorBoundary(args)
                  }}
                />
              )
            }}
          >
            <Outlet />
          </ErrorBoundary>
        </OutletWrapper>
      </LayoutWrapper>
    </SidebarProvider>
  )
}

const LayoutWrapper: React.FC<React.ComponentProps<'div'>> = tw.div`
	relative h-screen max-h-full flex-1 w-full overflow-y-scroll @container/layout-wrapper flex flex-col justify-between
	[counter-reset:h_var(--screen-height)_w_var(--screen-width)]
	xxl:[--header-height:120px]
	sm:[--outlet-padding-x:8px] 
	md:[--outlet-padding-x:8px] 
	lg:[--outlet-padding-x:8px] 
	xl:[--outlet-padding-x:16px] 
	xxl:[--outlet-padding-x:24px] 
	[&:has(*[data-outlet-padding=none])]:[--outlet-padding-x:0px]
	[&:has(*[data-outlet-padding=none])]:[--outlet-padding-y:0px]
	[--scrollbar-thickness:10px] 
	[--outlet-padding-y:16px] 
	[--header-height:56px] 
	xxl:[--outlet-wrapper-width:calc(var(--screen-width,100dvw)*1px-var(--sidebar-width)-2*var(--outlet-padding-x)-var(--scrollbar-thickness))]
	[--outlet-wrapper-width:calc(var(--screen-width,100dvw)*1px-2*var(--outlet-padding-x)-var(--scrollbar-thickness))]
	[--outlet-wrapper-height:calc(var(--screen-height,100dvh)*1px-var(--header-height)-2*var(--outlet-padding-x))]
`

const OutletWrapper: React.FC<React.ComponentProps<'main'>> = tw.main`
	relative flex-1 basis-full
	py-(--outlet-padding-y) px-(--outlet-padding-x) 
	min-h-(--outlet-wrapper-height) 
	max-w-[calc(var(--outlet-wrapper-width)+2*var(--outlet-padding-x))]
	
`
