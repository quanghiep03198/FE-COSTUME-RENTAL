import { CommonActions } from '@/common/constants/enums'
import { axiosClient } from '@/configs/axios.config'
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  type MutationFunction,
} from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useRef } from 'react'
import { toast } from 'sonner'
import type { TCreateUserValues } from '../schemas/create-user.schema'
import type { TUpdateUserValues } from '../schemas/update-user.schema'
import type { IUser } from '../types'

export const GET_USERS_QUERY_KEY = 'users_list' as const

export const getUsersQueryOptions = () => {
  return queryOptions({
    queryKey: [GET_USERS_QUERY_KEY],
    queryFn: async () =>
      await axiosClient.get<void, Array<IUser>, void>('/users', {
        params: { _expand: 'employee' },
      }),
  })
}

export const useGetUsersQuery = () => {
  return useQuery(getUsersQueryOptions())
}

export const useCreateOrUpdateUserMutataion = (
  action: CommonActions.CREATE | CommonActions.UPDATE | null
) => {
  const toastRef = useRef<string | number | null>(null)
  const queryClient = useQueryClient()

  const mutationConfigFactory: Map<
    CommonActions.CREATE | CommonActions.UPDATE,
    {
      handler: MutationFunction<any, any>
      message: string
    }
  > = new Map([
    [
      CommonActions.CREATE,
      {
        handler: async (payload: TCreateUserValues) =>
          await axiosClient.post('/users', {
            ...payload,
            is_active: true,
            created_at: new Date(),
            updated_at: null,
          }),
        message: 'Thêm mới người dùng thành công',
      },
    ],
    [
      CommonActions.UPDATE,
      {
        handler: async ({
          id,
          ...payload
        }: TUpdateUserValues & Pick<IUser, 'id'>) =>
          await axiosClient.patch(`/users/update/${id}`, payload),
        message: 'Đã cập nhật thành công',
      },
    ],
  ])

  const currentConfig = mutationConfigFactory.get(action!)

  return useMutation({
    mutationFn: currentConfig?.handler,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [GET_USERS_QUERY_KEY],
        exact: true,
      })
      toast.success(currentConfig?.message, { id: toastRef.current! })
    },
    onError: () => {
      toast.error('Đã có lỗi xảy ra !', { id: toastRef.current! })
    },
    onSettled() {
      // router.invalidate()
    },
  })
}

export const useUpdateUserStatusMutation = () => {
  const queryClient = useQueryClient()
  // const router = useRouter()

  return useMutation({
    mutationFn: async ({
      id,
      is_active,
    }: Pick<IUser, 'id'> & { is_active: boolean }) =>
      await axiosClient.patch(`/users/update/${id}`, {
        is_active,
        updated_at: new Date(),
      }),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [GET_USERS_QUERY_KEY],
        exact: true,
      })
    },
  })
}

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (id: number) => {
      return await axiosClient.delete(`/users/${id}`)
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [GET_USERS_QUERY_KEY],
        exact: true,
      })
    },
    onSettled: () => {
      router.invalidate()
    },
  })
}
