import { createFormData } from '@/common/helpers/form-data'
import { requestMiddleware } from '@/middlewares/request.middleware'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'

export const getImagesRpc = createServerFn({ method: 'GET' })
  .middleware([requestMiddleware])
  .handler(async ({ context }) => {
    return await context.request({ url: '/images-gallery', params: { _expand: 'category' } })
  })

export const uploadImagesRpc = createServerFn({ method: 'POST' })
  .middleware([requestMiddleware])
  .inputValidator(z.any())
  .handler(async ({ context, data }) => {
    return await context.request({
      url: '/images-gallery',
      method: 'POST',
      data: createFormData(data as any),
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  })

export const updateImageRpc = createServerFn({ method: 'POST' })
  .middleware([requestMiddleware])
  .inputValidator(z.object({ id: z.number(), file: z.instanceof(File) }))
  .handler(async ({ context, data: { id, ...update } }) => {
    return await context.request({ url: `/images-gallery/${id}`, method: 'PATCH', data: update })
  })

export const deleteImageRpc = createServerFn({ method: 'POST' })
  .middleware([requestMiddleware])
  .inputValidator(z.number())
  .handler(async ({ context, data }) => {
    return await context.request({ url: `/images-gallery/${data}`, method: 'DELETE' })
  })
