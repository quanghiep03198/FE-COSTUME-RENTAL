'use server'

import { useAuthStore } from '@/apis/auth/stores'
import type { IUser } from '@/apis/user/types'
import { axiosClient } from '@/configs/axios.config'
import { queryOptions, useMutation, useQuery, useQueryClient, type QueryKey } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { toast } from 'sonner'
import { logOutFn } from '../functions'

export const GET_PROFILE_QUERY_KEY = ['profile'] as const

export const getAuthUserQueryOptions = () => {
  return queryOptions({
    queryKey: GET_PROFILE_QUERY_KEY,
    queryFn: async () => await axiosClient.get<unknown, IUser>('/auth/me'),
  })
}

export const useGetAuthUserQuery = () => {
  return useQuery(getAuthUserQueryOptions())
}

/**
 * @summary Custom hook that provides authentication-related functionality.
 */
export default function useAuth() {
  const authStore = useAuthStore()
  const queryClient = useQueryClient()
  const router = useRouter()
  const logOut = useServerFn(logOutFn)

  const { mutateAsync: logOutAsync } = useMutation({
    mutationFn: async () => axiosClient.post('/auth/logout'),
    onMutate: () => {
      const queryCache = queryClient.getQueryCache()
      const cancelledQueryKeys = queryCache.getAll().reduce<QueryKey>((accumulator, currentQuery) => {
        if (currentQuery.state.status === 'pending' || currentQuery.state.status === 'error')
          return [...accumulator, ...currentQuery.queryKey.filter((key) => !!key)]
        else return accumulator
      }, [])
      queryClient.cancelQueries({ queryKey: cancelledQueryKeys, exact: false })
      return toast.loading('Đang xử lý ...')
    },
    onSettled: async (_data, _error, _variable, context) => {
      useAuthStore.getState().setAccessToken(null)
      useAuthStore.getState().resetCredentials()
      await logOut()
      queryClient.removeQueries({ type: 'all', exact: false }) // * remove all triggered queries
      queryClient.clear() // * clear cached queries
      await router.invalidate().then(() => router.navigate({ to: '/login' }))
      toast.success('Đăng nhập thành công', { id: context })
    },
  })

  const isAuthenticated = !!authStore.accessToken && !!authStore.user

  return { ...authStore, isAuthenticated, logout: logOutAsync }
}
