import { Position, WorkStatus } from '@/apis/employee/constants'
import { GET_EMPLOYEE_QUERY_KEY } from '@/apis/employee/hooks/use-employee-request'
import { CommonActions } from '@/common/constants/enums'
import { axiosClient } from '@/configs/axios.config'
import { queryOptions, useMutation, useSuspenseQuery } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import { useRef } from 'react'
import { toast } from 'sonner'
import type { TCreateUserValues } from '../schemas/create-user.schema'
import type { TUpdateUserValues } from '../schemas/update-user.schema'
import type { IUser } from '../types'

export const GET_USERS_QUERY_KEY = 'users' as const

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
  return useSuspenseQuery(getUsersQueryOptions())
}

type TMutateConfigFactory = {
  [CommonActions.CREATE]: {
    handler: (payload: TCreateUserValues) => Promise<AxiosResponse<any, any, {}>>
    message: string
  }
  [CommonActions.UPDATE]: {
    handler: ({ id, ...payload }: TUpdateUserValues & Pick<IUser, 'id'>) => Promise<AxiosResponse<any, any, {}>>
    message: string
  }
  none: {
    handler: AnonymousFunction
    message?: string
  }
}

export const useCreateOrUpdateUserMutataion = (action: CommonActions.CREATE | CommonActions.UPDATE | 'none') => {
  const mutationConfigFactory: TMutateConfigFactory = {
    [CommonActions.CREATE]: {
      handler: async (payload: TCreateUserValues) =>
        await axiosClient.post('/users', {
          ...payload,
          is_active: true,
          created_at: new Date(),
          updated_at: null,
        }),
      message: 'Thêm mới người dùng thành công',
    },
    [CommonActions.UPDATE]: {
      handler: async ({ id, ...payload }: TUpdateUserValues & Pick<IUser, 'id'>) =>
        await axiosClient.patch(`/users/update/${id}`, payload),
      message: 'Đã cập nhật thành công',
    },
    none: {
      handler: () => {},
    },
  }

  const toastRef = useRef<string | number | null>(null)

  const currentConfig = mutationConfigFactory[action]

  return useMutation({
    mutationFn: action !== 'none' ? currentConfig?.handler : () => {},
    meta: {
      invalidates: [
        [GET_USERS_QUERY_KEY],
        [
          GET_EMPLOYEE_QUERY_KEY,
          {
            'position:in': `${Position.MANAGER},${Position.ORDER_PROCESSOR},${Position.WAREHOUSE_MANAGER}`,
            'is_active:eq': true,
            'work_status:ne': WorkStatus.EXITED,
            'user_id:eq': 'null',
          },
        ],
      ],
    },
    onMutate: () => {
      toastRef.current = toast.loading('Đang xử lý ...')
    },
    onSuccess: () => {
      const message = currentConfig?.message || 'Thao tác thành công'
      toast.success(message, { id: toastRef.current! })
    },
    onError: () => {
      toast.error('Đã có lỗi xảy ra !', { id: toastRef.current! })
    },
  })
}

export const useDeleteUserMutation = () => {
  // const accessToken = getTokenFn()

  return useMutation({
    mutationFn: async (id: number) => {
      return await axiosClient.delete(`/users/${id}`)
    },
    meta: {
      invalidates: [
        [GET_USERS_QUERY_KEY],
        [
          GET_EMPLOYEE_QUERY_KEY,
          {
            'position:in': `${Position.MANAGER},${Position.ORDER_PROCESSOR},${Position.WAREHOUSE_MANAGER}`,
            'is_active:eq': true,
            'work_status:ne': WorkStatus.EXITED,
            'user_id:eq': 'null',
          },
        ],
      ],
    },
  })
}
