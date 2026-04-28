import { ItemType } from '@/common/constants/enums'
import { requestMiddleware } from '@/middlewares/request.middleware'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { createCategorySchema } from '../schemas/create-category.schema'
import { updateCategorySchema } from '../schemas/update-category.schema'

export const getCategoriesRpc = createServerFn({ method: 'GET' })
  .middleware([requestMiddleware])
  .inputValidator(z.object({ 'type.eq': z.nativeEnum(ItemType) }).optional())
  .handler(async ({ context, data }) => {
    return await context.request({ url: '/categories', params: data })
  })

export const createCategoryRpc = createServerFn({ method: 'POST' })
  .middleware([requestMiddleware])
  .inputValidator(createCategorySchema)
  .handler(async ({ context, data }) => {
    return await context.request({ url: '/categories', method: 'POST', data })
  })

export const updateCategoryRpc = createServerFn({ method: 'POST' })
  .middleware([requestMiddleware])
  .inputValidator(updateCategorySchema)
  .handler(async ({ context, data: { id, ...update } }) => {
    return await context.request({ url: `/categories/${id}`, method: 'POST', data: update })
  })

export const deleteCategoryRpc = createServerFn({ method: 'POST' })
  .middleware([requestMiddleware])
  .inputValidator(z.number())
  .handler(async ({ context, data }) => {
    return await context.request({ url: `/categories/${data}`, method: 'DELETE' })
  })
