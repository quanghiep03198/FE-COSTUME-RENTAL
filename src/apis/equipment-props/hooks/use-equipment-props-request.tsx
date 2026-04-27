import { CommonActions } from '@/common/constants/enums'
import { axiosClient } from '@/configs/axios.config'
import { queryOptions, useMutation, useSuspenseQuery, type MutationFunction } from '@tanstack/react-query'
import type { AxiosResponse } from 'axios'
import { toast } from 'sonner'
import type { TCreateEquipmentPropsValues } from '../schemas/create-equipment-props.schema'
import type { TUpdateEquipmentPropsValues } from '../schemas/update-equipment-props.schema'
import type { IEquipmentProps } from '../types'

export const GET_PROPS_QUERY_KEY = 'equipmentprops' as const

export const getPropsQueryOptions = () => {
  return queryOptions({
    queryKey: [GET_PROPS_QUERY_KEY],
    queryFn: async () =>
      await axiosClient.get<unknown, IEquipmentProps[]>('/equipment-props', { params: { _expand: 'category,image' } }),
  })
}

export const useGetPropsQuery = () => {
  return useSuspenseQuery(getPropsQueryOptions())
}

type TMutationConfigFactory = {
  [CommonActions.CREATE]: {
    handler: (data: TCreateEquipmentPropsValues) => Promise<AxiosResponse<IEquipmentProps>>
    message: string
  }
  [CommonActions.UPDATE]: {
    handler: (data: TUpdateEquipmentPropsValues) => Promise<AxiosResponse<IEquipmentProps>>
    message: string
  }
  none: {
    handler: MutationFunction<any, any>
    message?: never
  }
}

export const useCreateOrUpdatePropsMutation = (action: CommonActions.CREATE | CommonActions.UPDATE | 'none') => {
  const mutationConfigFactory: TMutationConfigFactory = {
    [CommonActions.CREATE]: {
      handler: async (data: TCreateEquipmentPropsValues) => await axiosClient.post('/equipment-props', data),
      message: 'Thêm mới đạo cụ thành công',
    },
    [CommonActions.UPDATE]: {
      handler: async ({ id, ...data }: TUpdateEquipmentPropsValues) =>
        await axiosClient.patch(`/equipment-props/${id}`, data),
      message: 'Cập nhật đạo cụ thành công',
    },
    none: {
      handler: () => Promise.resolve(),
    },
  }

  const currentConfig = mutationConfigFactory[action]

  return useMutation({
    meta: {
      invalidates: [[GET_PROPS_QUERY_KEY]],
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

export const useDeletePropsMutation = () => {
  return useMutation({
    meta: {
      invalidates: [[GET_PROPS_QUERY_KEY]],
    },
    mutationFn: async (id: number) =>
      await axiosClient.delete(`/equipment-props/${id}`, { params: { permanantly: true } }),
    onSuccess: () => {
      toast.success('Xóa trang phục thành công')
    },
    onError: () => {
      toast.error('Có lỗi xảy ra, vui lòng thử lại')
    },
  })
}
