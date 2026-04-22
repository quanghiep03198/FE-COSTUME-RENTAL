import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { ErrorBoundaryFallback } from './components/errors/error-boundary-fallback'
import { NotFoundPage } from './components/errors/not-found'
import { queryClient } from './providers/query-client-provider'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreload: 'render',
    defaultPreloadStaleTime: 5 * 60 * 1000, // 5 minutes
    defaultErrorComponent: ErrorBoundaryFallback,
    defaultNotFoundComponent: NotFoundPage,
  })

  setupRouterSsrQueryIntegration({ router, queryClient })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
