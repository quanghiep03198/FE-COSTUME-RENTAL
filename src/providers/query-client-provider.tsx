import { GlobalConfig } from '@/configs/global.config'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { broadcastQueryClient } from '@tanstack/query-broadcast-client-experimental'
import { MutationCache, QueryClient, type QueryKey } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import type { AxiosError } from 'axios'

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: AxiosError
    mutationMeta: {
      invalidatesQuery?: QueryKey
      successMessage?: string
      errorMessage?: string
    }
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 60 * 24, // 24h - must be >= maxAge for persister to work
      // experimental_prefetchInRender: true,
      networkMode: 'always',
    },
    mutations: {
      networkMode: 'always',
    },
  },
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _context, mutation) => {
      queryClient.invalidateQueries({
        queryKey: mutation.options.mutationKey,
      })
    },
  }),
})

// Only persist on client side — SSR hydration is handled by TanStack Start
if (typeof window !== 'undefined') {
  broadcastQueryClient({
    queryClient: queryClient as unknown as Parameter<typeof broadcastQueryClient>['queryClient'],
    broadcastChannel: 'costume-rental', // Optional: defaults to 'react-query'
  })

  const asyncLocalStoragePersister = createAsyncStoragePersister({
    storage: window.localStorage,
    key: GlobalConfig.QUERY_CLIENT_CACHE_STORAGE_KEY,
    serialize: (data) => JSON.stringify(data),
    deserialize: (data) => JSON.parse(data),
  })

  persistQueryClient({
    queryClient,
    persister: asyncLocalStoragePersister,
    maxAge: 1000 * 60 * 60 * 24, // 24h
  })
}
