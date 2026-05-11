import { authMiddleware } from '@/middlewares/auth.middleware'
import { requestMiddleware } from '@/middlewares/request.middleware'
import { createServerFn } from '@tanstack/react-start'
import { number } from 'zod'
import { updateEquipmentPropsReqSchema } from '../schemas/update-equipment-props.schema'
import { createEquipmentPropsReqSchema } from './../schemas/create-equipment-props.schema'

export const getEquipmentPropsRpc = createServerFn({ method: 'GET' })
  .middleware([authMiddleware, requestMiddleware])
  .handler(async ({ context }) => {
    return await context.request({ url: '/equipment-props' })
  })

export const createEquipmentPropsRpc = createServerFn({ method: 'POST' })
  .inputValidator(createEquipmentPropsReqSchema)
  .middleware([authMiddleware, requestMiddleware])
  .handler(async ({ data, context }) => {
    return await context.request({
      url: '/equipment-props',
      method: 'POST',
      data: data,
    })
  })

export const updateEquipmentPropsRpc = createServerFn({ method: 'POST' })
  .middleware([requestMiddleware])
  .inputValidator(updateEquipmentPropsReqSchema)
  .handler(async ({ context, data: { id, ...update } }) => {
    return await context.request({
      url: `/equipment-props/${id}`,
      method: 'PATCH',
      data: update,
    })
  })

export const deleteEquipmentPropsRpc = createServerFn({ method: 'POST' })
  .middleware([authMiddleware, requestMiddleware])
  .inputValidator(number())
  .handler(async ({ context, data: id }) => {
    return await context.request({
      url: `/equipment-props/${id}`,
      method: 'DELETE',
      params: { permanantly: true },
    })
  })
