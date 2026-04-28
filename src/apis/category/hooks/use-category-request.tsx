import { CommonActions, ItemType } from '@/common/constants/enums'
import {
  queryOptions,
  useMutation,
  useSuspenseQuery,
  type MutationFunction,
  type MutationKey,
} from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { toast } from 'sonner'
import { createCategoryRpc, deleteCategoryRpc, getCategoriesRpc, updateCategoryRpc } from '../rpc'
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
    queryFn: () => getCategoriesRpc(params),
  })
}

export const useGetCategoriesQuery = (params: RequestQuery) => {
  return useSuspenseQuery(getCategoriesQueryOptions(params))
}

type TMutationConfigFactory = {
  [CommonActions.CREATE]: {
    handler: (data: TCreateCategoryValues) => Promise<ICategory>
    message: string
  }
  [CommonActions.UPDATE]: {
    handler: (data: TUpdateCategoryValues) => Promise<ICategory>
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
  const createCategoryFn = useServerFn(createCategoryRpc)
  const updateCategoryFn = useServerFn(updateCategoryRpc)

  const mutationConfigFactory: TMutationConfigFactory = {
    [CommonActions.CREATE]: {
      handler: (data) => createCategoryFn({ data }),
      message: 'Thêm mới danh mục thành công',
    },
    [CommonActions.UPDATE]: {
      handler: (data) => updateCategoryFn({ data }),
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
  const deleteCategoryFn = useServerFn(deleteCategoryRpc)

  return useMutation({
    meta: {
      invalidates: [GET_CATEGORIES_QUERY_KEY, mutationKey],
    },
    mutationFn: (id: number) => deleteCategoryFn({ data: id }),
    onSuccess: () => {
      toast.success('Xóa danh mục thành công')
    },
    onError: () => {
      toast.error('Có lỗi xảy ra, vui lòng thử lại')
    },
  })
}
