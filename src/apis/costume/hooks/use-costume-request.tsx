import { CommonActions } from '@/common/constants/enums'
import { queryOptions, useMutation, useSuspenseQuery, type MutationFunction } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { toast } from 'sonner'
import { createCostumeRpc, deleteCostumeRpc, getCostumesRpc, updateCostumeRpc } from '../rpc'
import type { TCreateCostumeReqValues } from '../schemas/create-costume.schema'
import type { TUpdateCostumeReqValues } from '../schemas/update-costume.schema'
import type { ICostume } from '../types'

export const GET_COSTUMES_QUERY_KEY = 'costumes' as const

export const getCostumesQueryOptions = () => {
  return queryOptions({
    queryKey: [GET_COSTUMES_QUERY_KEY],
    queryFn: () => getCostumesRpc(),
  })
}

export const useGetCostumesQuery = () => {
  return useSuspenseQuery(getCostumesQueryOptions())
}

type TMutationConfigFactory = {
  [CommonActions.CREATE]: {
    handler: (data: TCreateCostumeReqValues) => Promise<ICostume>
    message: string
  }
  [CommonActions.UPDATE]: {
    handler: (data: TUpdateCostumeReqValues) => Promise<ICostume>
    message: string
  }
  none: {
    handler: MutationFunction<any, any>
    message?: never
  }
}

export const useCreateOrUpdateCostumeMutation = (action: CommonActions.CREATE | CommonActions.UPDATE | 'none') => {
  const createCostumeFn = useServerFn(createCostumeRpc)
  const updateCostumeFn = useServerFn(updateCostumeRpc)

  const mutationConfigFactory: TMutationConfigFactory = {
    [CommonActions.CREATE]: {
      handler: (data: TCreateCostumeReqValues) => createCostumeFn({ data }),
      message: 'Thêm mới trang phục thành công',
    },
    [CommonActions.UPDATE]: {
      handler: async (data: TUpdateCostumeReqValues) => updateCostumeFn({ data }),
      message: 'Cập nhật trang phục thành công',
    },
    none: {
      handler: () => Promise.resolve(),
    },
  }

  const currentConfig = mutationConfigFactory[action]

  return useMutation({
    meta: {
      invalidates: [[GET_COSTUMES_QUERY_KEY]],
    },
    mutationFn: currentConfig.handler,
    onSuccess: () => {
      if (currentConfig.message) {
        toast.success(currentConfig.message)
      }
    },
    onError: () => {
      toast.error('Có lỗi xảy ra, vui lòng thử lại')
    },
  })
}

export const useDeleteCostumeMutation = () => {
  const deleteCostumeFn = useServerFn(deleteCostumeRpc)

  return useMutation({
    meta: {
      invalidates: [[GET_COSTUMES_QUERY_KEY]],
    },
    mutationFn: (id: number) => deleteCostumeFn({ data: id }),
    onSuccess: () => {
      toast.success('Xóa trang phục thành công')
    },
    onError: () => {
      toast.error('Có lỗi xảy ra, vui lòng thử lại')
    },
  })
}
