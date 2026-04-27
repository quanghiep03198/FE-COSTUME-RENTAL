import { createFormData, MULTIPART_HEADER } from '@/common/helpers/form-data'
import { axiosClient } from '@/configs/axios.config'
import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import type { IImage } from '../types'

export const GET_IMAGES_QUERY_KEY = 'images' as const

export const getImagesQueryOptions = () => {
  return queryOptions({
    queryKey: [GET_IMAGES_QUERY_KEY],
    staleTime: 0,
    queryFn: async () =>
      await axiosClient.get<unknown, IImage[]>('/images-gallery', { params: { _expand: 'category' } }),
  })
}

export const useGetImagesQuery = () => {
  return useQuery(getImagesQueryOptions())
}

export const useUploadImagesMutation = () => {
  return useMutation({
    meta: { invalidates: [[GET_IMAGES_QUERY_KEY]] },
    mutationFn: async (files) => await axiosClient.post('/images-gallery', createFormData({ files }), MULTIPART_HEADER),
  })
}

export const useUpdateImageMutation = () => {
  return useMutation({
    meta: { invalidates: [[GET_IMAGES_QUERY_KEY]] },
    mutationFn: async ({ id, file }: { id: number; file: File }) =>
      await axiosClient.post(`/images-gallery/${id}`, createFormData({ file, _method: 'PATCH' }), MULTIPART_HEADER),
  })
}

export const useDeleteImageMutation = () => {
  return useMutation({
    meta: { invalidates: [[GET_IMAGES_QUERY_KEY]] },
    mutationFn: async (id: number) => await axiosClient.delete(`/images-gallery/${id}`),
  })
}
