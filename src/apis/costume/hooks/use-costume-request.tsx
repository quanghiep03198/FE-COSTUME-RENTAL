import { CommonActions } from '@/common/constants/enums'
import { axiosClient } from '@/configs/axios.config'
import { queryOptions, useMutation, useSuspenseQuery, type MutationFunction } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import { toast } from 'sonner'
import type { TCreateCostumeValues } from '../schemas/create-costume.schema'
import type { TUpdateCostumeValues } from '../schemas/update-costume.schema'
import type { ICostume } from '../types'

export const GET_COSTUMES_QUERY_KEY = 'costumes' as const

export const getCostumesQueryOptions = () => {
  return queryOptions({
    queryKey: [GET_COSTUMES_QUERY_KEY],
    queryFn: async () => await axiosClient.get<unknown, ICostume[]>('/costumes'),
  })
}

export const useGetCostumesQuery = () => {
  return useSuspenseQuery(getCostumesQueryOptions())
}

type TMutationConfigFactory = {
  [CommonActions.CREATE]: {
    handler: (data: TCreateCostumeValues) => Promise<AxiosResponse<ICostume>>
    message: string
  }
  [CommonActions.UPDATE]: {
    handler: (data: TUpdateCostumeValues) => Promise<AxiosResponse<ICostume>>
    message: string
  }
  none: {
    handler: MutationFunction<any, any>
    message?: never
  }
}

export const useCreateOrUpdateCostumeMutation = (action: CommonActions.CREATE | CommonActions.UPDATE | 'none') => {
  const mutationConfigFactory: TMutationConfigFactory = {
    [CommonActions.CREATE]: {
      handler: async (data: TCreateCostumeValues) => await axiosClient.post('/costumes', data),
      message: 'Thêm mới danh mục thành công',
    },
    [CommonActions.UPDATE]: {
      handler: async ({ id, ...data }: TUpdateCostumeValues) => await axiosClient.patch(`/costumes/${id}`, data),
      message: 'Cập nhật danh mục thành công',
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
  return useMutation({
    meta: {
      invalidates: [[GET_COSTUMES_QUERY_KEY]],
    },
    mutationFn: async (id: number) => await axiosClient.delete(`/costumes/${id}`, { params: { permanantly: true } }),
    onSuccess: () => {
      toast.success('Xóa danh mục thành công')
    },
    onError: () => {
      toast.error('Có lỗi xảy ra, vui lòng thử lại')
    },
  })
}
