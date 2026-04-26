import { CommonActions, ItemType } from '@/common/constants/enums'
import { axiosClient } from '@/configs/axios.config'
import {
  queryOptions,
  useMutation,
  useSuspenseQuery,
  type MutationFunction,
  type MutationKey,
} from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import { toast } from 'sonner'
import type { TCreateCategoryValues } from '../schemas/create-category.schema'
import type { TUpdateCategoryValues } from '../schemas/update-category.schema'
import type { ICategory } from '../types'

export const GET_CATEGORIES_QUERY_KEY = ['categories']

export const GET_COSTUME_CATEGORY_QUERY_KEY: RequestQuery = {
  'type:eq': ItemType.COSTUMES,
}

export const GET_PROPS_CATEGORY_QUERY_KEY: RequestQuery = {
  'type:eq': ItemType.EQUIPMENT_PROPS,
}

export const getCategoriesQueryOptions = (params: RequestQuery) => {
  return queryOptions({
    queryKey: [GET_CATEGORIES_QUERY_KEY, params],
    queryFn: async () => await axiosClient.get<unknown, ICategory[]>('/categories', { params }),
  })
}

export const useGetCategoriesQuery = (params: RequestQuery) => {
  return useSuspenseQuery(getCategoriesQueryOptions(params))
}

type TMutationConfigFactory = {
  [CommonActions.CREATE]: {
    handler: (data: TCreateCategoryValues) => Promise<AxiosResponse<ICategory>>
    message: string
  }
  [CommonActions.UPDATE]: {
    handler: (data: TUpdateCategoryValues) => Promise<AxiosResponse<ICategory>>
    message: string
  }
  none: {
    handler: MutationFunction<any, any>
    message?: never
  }
}

export const useCreateOrUpdateCategoryMutation = (
  action: CommonActions.CREATE | CommonActions.UPDATE | 'none',
  mutationKey: MutationKey
) => {
  const mutationConfigFactory: TMutationConfigFactory = {
    [CommonActions.CREATE]: {
      handler: async (data) => await axiosClient.post('/categories', data),
      message: 'Thêm mới danh mục thành công',
    },
    [CommonActions.UPDATE]: {
      handler: async ({ id, ...data }) => await axiosClient.patch(`/categories/${id}`, data),
      message: 'Cập nhật danh mục thành công',
    },
    none: {
      handler: () => Promise.resolve(),
    },
  }

  const currentConfig = mutationConfigFactory[action]

  return useMutation({
    meta: {
      invalidates: [GET_CATEGORIES_QUERY_KEY, mutationKey],
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

export const useDeleteCategoryMutation = (mutationKey: MutationKey) => {
  return useMutation({
    meta: {
      invalidates: [GET_CATEGORIES_QUERY_KEY, mutationKey],
    },
    mutationFn: async (id: number) => await axiosClient.delete(`/categories/${id}`),
    onSuccess: () => {
      toast.success('Xóa danh mục thành công')
    },
    onError: () => {
      toast.error('Có lỗi xảy ra, vui lòng thử lại')
    },
  })
}
