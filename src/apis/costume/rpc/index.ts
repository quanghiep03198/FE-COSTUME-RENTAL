import { authMiddleware } from '@/middlewares/auth.middleware'
import { requestMiddleware } from '@/middlewares/request.middleware'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { createCostumeReqSchema } from '../schemas/create-costume.schema'
import { updateCostumeReqSchema } from '../schemas/update-costume.schema'
import type { ICostume } from '../types'

export const getCostumesRpc = createServerFn({ method: 'GET' })
  .middleware([authMiddleware, requestMiddleware])
  .handler(async ({ context }) => {
    return await context.request<ICostume[]>({ url: '/costumes' })
  })

export const createCostumeRpc = createServerFn({ method: 'POST' })
  .middleware([authMiddleware, requestMiddleware])
  .inputValidator(createCostumeReqSchema)
  .handler(async ({ context, data }) => {
    return await context.request<ICostume>({ url: '/costumes', method: 'POST', data })
  })

export const updateCostumeRpc = createServerFn({ method: 'POST' })
  .middleware([authMiddleware, requestMiddleware])
  .inputValidator(updateCostumeReqSchema)
  .handler(async ({ context, data: { id, ...update } }) => {
    return await context.request<ICostume>({ url: `/costumes/${id}`, method: 'PATCH', data: update })
  })

export const deleteCostumeRpc = createServerFn({ method: 'POST' })
  .middleware([authMiddleware, requestMiddleware])
  .inputValidator(z.number())
  .handler(async ({ context, data }) => {
    return await context.request({ url: `/costumes/${data}`, method: 'DELETE', params: { permanantly: true } })
  })
