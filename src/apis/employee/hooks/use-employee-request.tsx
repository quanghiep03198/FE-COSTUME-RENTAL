import { CommonActions } from '@/common/constants/enums'
import { axiosClient } from '@/configs/axios.config'
import {
  queryOptions,
  useMutation,
  useQueryClient,
  type MutationFunction,
} from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import type { AxiosRequestConfig } from 'axios'
import { useRef } from 'react'
import { toast } from 'sonner'
import type { TCreateEmployeeValues } from '../schemas/create-employee.schema'
import type { TUpdateEmployeeValues } from '../schemas/update-employee.schema'
import type { IEmployee } from '../types'

export const GET_EMPLOYEE_QUERY_KEY = ['employees'] as const

export const getEmployeeQueryOptions = (
  params?: AxiosRequestConfig['params']
) => {
  return queryOptions({
    queryKey: [...GET_EMPLOYEE_QUERY_KEY, params],
    queryFn: async () =>
      await axiosClient.get<unknown, IEmployee[]>('/employees', { params }),
  })
}

export const useCreateOrUpdateEmployeeMutataion = (
  action: CommonActions.CREATE | CommonActions.UPDATE | null
) => {
  const toastRef = useRef<string | number | null>(null)
  const queryClient = useQueryClient()
  const router = useRouter()

  const mutationConfigFactory: Map<
    CommonActions.CREATE | CommonActions.UPDATE,
    {
      handler: MutationFunction<
        unknown,
        TCreateEmployeeValues | TUpdateEmployeeValues
      >
      message: string
    }
  > = new Map([
    [
      CommonActions.CREATE,
      {
        handler: async (payload: TCreateEmployeeValues) =>
          await axiosClient.post('/employees/create', {
            ...payload,
            is_active: true,
            created_at: new Date(),
            updated_at: null,
          }),
        message: 'Thêm mới nhân viên thành công',
      },
    ],
    [
      CommonActions.UPDATE,
      {
        handler: async ({
          id,
          ...payload
        }: TUpdateEmployeeValues & Pick<IEmployee, 'id'>) =>
          await axiosClient.patch(`/employees/update/${id}`, {
            ...payload,
            updated_at: new Date(),
          }),
        message: 'Đã cập nhật thành công',
      },
    ],
  ])

  const currentConfig = mutationConfigFactory.get(action!)

  return useMutation({
    mutationFn: currentConfig?.handler,
    onMutate: () => {
      toastRef.current = toast.loading('Đang xử lý ...')
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: GET_EMPLOYEE_QUERY_KEY,
        exact: true,
      })
      toast.success(currentConfig?.message, { id: toastRef.current! })
      router.invalidate()
    },
    onError: () => {
      toast.error('Đã có lỗi xảy ra !', { id: toastRef.current! })
    },
  })
}

export const useUpdateUserStatusMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      is_active,
    }: {
      id: number
      is_active: boolean
    }) => {
      return await axiosClient.patch(`/employees/update/${id}`, { is_active })
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: GET_EMPLOYEE_QUERY_KEY,
        exact: true,
      })
    },
  })
}

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      return await axiosClient.delete(`/employees/${id}`)
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: GET_EMPLOYEE_QUERY_KEY,
        exact: true,
      })
    },
  })
}
