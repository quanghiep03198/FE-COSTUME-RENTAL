import { CommonActions } from '@/common/constants/enums'
import { axiosClient } from '@/configs/axios.config'
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { useRef } from 'react'
import { toast } from 'sonner'
import type { TCreateEmployeeValues } from '../schemas/create-employee.schema'
import type { TUpdateEmployeeValues } from '../schemas/update-employee.schema'
import type { IEmployee } from '../types'

export const GET_EMPLOYEE_QUERY_KEY = 'employees'

export const getEmployeeQueryOptions = (params?: AxiosRequestConfig['params']) => {
  const queryKey = [GET_EMPLOYEE_QUERY_KEY]
  if (params) queryKey.push(params)
  return queryOptions({
    queryKey,
    queryFn: async () => await axiosClient.get<unknown, IEmployee[]>('/employees', { params }),
  })
}

export const useGetEmployeesQuery = (params?: AxiosRequestConfig['params']) => {
  return useSuspenseQuery(getEmployeeQueryOptions(params))
}

type TMutationFactory = {
  [CommonActions.CREATE]: {
    handler: (payload: TCreateEmployeeValues) => Promise<AxiosResponse<any, any, {}>>
    message: string
  }
  [CommonActions.UPDATE]: {
    handler: (payload: TUpdateEmployeeValues & Pick<IEmployee, 'id'>) => Promise<AxiosResponse<any, any, {}>>
    message: string
  }
  ['none']: { handler: AnonymousFunction; message?: never }
}

export const useCreateOrUpdateEmployeeMutataion = (action: CommonActions.CREATE | CommonActions.UPDATE | 'none') => {
  const toastRef = useRef<string | number | null>(null)
  const queryClient = useQueryClient()

  const mutationConfigFactory: TMutationFactory = {
    [CommonActions.CREATE]: {
      handler: async (payload: TCreateEmployeeValues) =>
        await axiosClient.post('/employees/create', {
          ...payload,
          is_active: true,
          created_at: new Date(),
          updated_at: null,
        }),
      message: 'Thêm mới nhân viên thành công',
    },

    [CommonActions.UPDATE]: {
      handler: async ({ id, ...payload }) =>
        await axiosClient.patch(`/employees/${id}`, {
          ...payload,
          updated_at: new Date(),
        }),
      message: 'Đã cập nhật thành công',
    },
    ['none']: { handler: () => {} },
  }

  const currentConfig = mutationConfigFactory[action]

  return useMutation({
    meta: {
      invalidates: [[GET_EMPLOYEE_QUERY_KEY]],
    },
    mutationFn: action !== 'none' ? currentConfig?.handler : () => {},
    onMutate: () => {
      toastRef.current = toast.loading('Đang xử lý ...')
    },
    onSuccess: () => {
      toast.success(currentConfig?.message, { id: toastRef.current! })
    },
    onError: () => {
      toast.error('Đã có lỗi xảy ra !', { id: toastRef.current! })
    },
  })
}

export const useUpdateUserStatusMutation = () => {
  return useMutation({
    mutationFn: async ({ id, is_active }: { id: number; is_active: boolean }) => {
      return await axiosClient.patch(`/employees/${id}`, { is_active })
    },
    meta: {
      invalidates: [[GET_EMPLOYEE_QUERY_KEY]],
    },
  })
}

export const useDeleteUserMutation = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      return await axiosClient.delete(`/employees/${id}`)
    },
    meta: {
      invalidates: [[GET_EMPLOYEE_QUERY_KEY]],
    },
  })
}
