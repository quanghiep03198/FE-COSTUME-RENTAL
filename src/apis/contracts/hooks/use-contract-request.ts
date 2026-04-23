import { CommonActions } from '@/common/constants/enums'
import { axiosClient } from '@/configs/axios.config'
import { queryOptions, useMutation, useSuspenseQuery } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import { useRef } from 'react'
import { toast } from 'sonner'
import type { TCreateContractValues } from '../schemas/create-contract.schema'
import type { TUpdateContractValues } from '../schemas/update-contract.schema'
import type { IContract } from '../types'

export const GET_CONTRACTS_QUERY_KEY = 'contracts' as const

export const getContractsQueryOptions = () => {
  return queryOptions({
    queryKey: [GET_CONTRACTS_QUERY_KEY],
    queryFn: async () => await axiosClient.get<unknown, IContract[]>('/contracts'),
  })
}

export const useGetContractsQuery = () => {
  return useSuspenseQuery(getContractsQueryOptions())
}

type TMutateConfigFactory = {
  [CommonActions.CREATE]: {
    handler: (payload: TCreateContractValues) => Promise<AxiosResponse<any, any, {}>>
    message: string
  }
  [CommonActions.UPDATE]: {
    handler: (payload: TUpdateContractValues & Pick<IContract, 'id'>) => Promise<AxiosResponse<any, any, {}>>
    message: string
  }
  ['none']: { handler: AnonymousFunction; message?: never }
}

export const useCreateOrUpdateContractMutation = (action: CommonActions.CREATE | CommonActions.UPDATE | 'none') => {
  const mutationConfigFactory: TMutateConfigFactory = {
    [CommonActions.CREATE]: {
      handler: async (payload: TCreateContractValues) =>
        await axiosClient.post('/contracts', {
          ...payload,
          is_active: true,
          created_at: new Date(),
          updated_at: null,
        }),
      message: 'Thêm mới người dùng thành công',
    },
    [CommonActions.UPDATE]: {
      handler: async ({ id, ...payload }: TUpdateContractValues & Pick<IContract, 'id'>) =>
        await axiosClient.patch(`/contracts/update/${id}`, payload),
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
      invalidates: [[GET_CONTRACTS_QUERY_KEY]],
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
