import { authMiddleware } from '@/middlewares/auth.middleware'
import { requestMiddleware } from '@/middlewares/request.middleware'
import { createServerFn } from '@tanstack/react-start'
import { number } from 'zod'
import { createUserSchema } from '../schemas/create-user.schema'
import { updateUserSchema } from '../schemas/update-user.schema'

export const getUsersRpc = createServerFn({ method: 'GET' })
  .middleware([authMiddleware, requestMiddleware])
  .handler(async ({ context }) => {
    return await context.request({ url: '/users', method: 'GET', params: { _expand: 'employee' } })
  })

export const createUserRpc = createServerFn({ method: 'POST' })
  .inputValidator(createUserSchema)
  .middleware([authMiddleware, requestMiddleware])
  .handler(async ({ context, data }) => {
    return await context.request({
      url: '/users',
      method: 'POST',
      data: {
        ...data,
        employee_id: data.employee.id,
      },
    })
  })

export const updateUserRpc = createServerFn({ method: 'POST' })
  .inputValidator(updateUserSchema)
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
