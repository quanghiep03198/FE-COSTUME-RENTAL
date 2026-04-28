import { authMiddleware } from '@/middlewares/auth.middleware'
import { requestMiddleware } from '@/middlewares/request.middleware'
import { createServerFn } from '@tanstack/react-start'
import { number } from 'zod'
import { createUserReqSchema } from '../schemas/create-user.schema'
import { updateUserReqSchema } from '../schemas/update-user.schema'

export const getUsersRpc = createServerFn({ method: 'GET' })
  .middleware([authMiddleware, requestMiddleware])
  .handler(async ({ context }) => {
    return await context.request({ url: '/users', method: 'GET', params: { _expand: 'employee' } })
  })

export const createUserRpc = createServerFn({ method: 'POST' })
  .inputValidator(createUserReqSchema)
  .middleware([authMiddleware, requestMiddleware])
  .handler(async ({ context, data }) => {
    return await context.request({ url: '/users', method: 'POST', data })
  })

export const updateUserRpc = createServerFn({ method: 'POST' })
  .inputValidator(updateUserReqSchema)
  .middleware([authMiddleware, requestMiddleware])
  .handler(async ({ context, data: { id, ...update } }) => {
    return await context.request({ url: `/users/${id}`, method: 'PATCH', data: update })
  })

export const deleteUserRpc = createServerFn({ method: 'POST' })
  .inputValidator(number())
  .middleware([authMiddleware, requestMiddleware])
  .handler(async ({ context, data: id }) => {
    return await context.request({ url: `/users/${id}`, method: 'DELETE' })
  })
