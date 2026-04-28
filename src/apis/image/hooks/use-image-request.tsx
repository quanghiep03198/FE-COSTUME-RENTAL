import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { deleteImageRpc, getImagesRpc, updateImageRpc, uploadImagesRpc } from '../rpc'

export const GET_IMAGES_QUERY_KEY = 'images' as const

export const getImagesQueryOptions = () => {
  return queryOptions({
    queryKey: [GET_IMAGES_QUERY_KEY],
    queryFn: () => getImagesRpc(),
  })
}

export const useGetImagesQuery = () => {
  return useQuery(getImagesQueryOptions())
}

export const useUploadImagesMutation = () => {
  return useMutation({
    meta: { invalidates: [[GET_IMAGES_QUERY_KEY]] },
    mutationFn: (data) => uploadImagesRpc({ data }),
  })
}

export const useUpdateImageMutation = () => {
  const updateImageFn = useServerFn(updateImageRpc)

  return useMutation({
    meta: { invalidates: [[GET_IMAGES_QUERY_KEY]] },
    mutationFn: async (data: { id: number; file: File }) => updateImageFn({ data }),
  })
}

export const useDeleteImageMutation = () => {
  const deleteImageFn = useServerFn(deleteImageRpc)

  return useMutation({
    meta: { invalidates: [[GET_IMAGES_QUERY_KEY]] },
    mutationFn: async (id: number) => deleteImageFn({ data: id }),
  })
}
