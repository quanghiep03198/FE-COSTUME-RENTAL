import { authMiddleware } from '@/middlewares/auth.middleware'
import { requestMiddleware } from '@/middlewares/request.middleware'
import { createServerFn } from '@tanstack/react-start'
import { number } from 'zod'
import { createEmployeeSchema } from '../schemas/create-employee.schema'
import { getEmployeeNonUserSchema } from '../schemas/get-employee-non-user.schema'
import { updateEmployeeSchema } from '../schemas/update-employee.schema'

export const getEmployeeRpc = createServerFn({ method: 'GET' })
  .middleware([authMiddleware, requestMiddleware])
  .inputValidator(getEmployeeNonUserSchema)
  .handler(async ({ context, data }) => {
    return await context.request({ url: '/employees', params: data })
  })

export const createEmployeeRpc = createServerFn({ method: 'POST' })
  .middleware([authMiddleware, requestMiddleware])
  .inputValidator(createEmployeeSchema)
  .handler(async ({ context, data }) => {
    return await context.request({ url: '/employees', method: 'POST', data })
  })

export const updateEmployeeRpc = createServerFn({ method: 'POST' })
  .middleware([authMiddleware, requestMiddleware])
  .inputValidator(updateEmployeeSchema)
  .handler(async ({ context, data: { id, ...update } }) => {
    console.log('update', update)
    return await context.request({ url: `/employees/${id}`, method: 'PATCH', data: update })
  })

export const deleteEmployeeRpc = createServerFn({ method: 'POST' })
  .middleware([authMiddleware, requestMiddleware])
  .inputValidator(number())
  .handler(async ({ context, data: id }) => {
    return await context.request({ url: `/employees/${id}`, method: 'DELETE' })
  })
