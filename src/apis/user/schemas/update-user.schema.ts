import { number, type infer as Infer } from 'zod'
import { createUserReqSchema, createUserSchema } from './create-user.schema'

export const updateUserSchema = createUserSchema.partial().omit({ employee_id: true })

export const updateUserReqSchema = createUserReqSchema.partial().extend({ id: number() })

export type TUpdateUserSchema = typeof updateUserSchema

export type TUpdateUserValues = Infer<TUpdateUserSchema>

export type TUpdateUserReqValues = Infer<typeof updateUserReqSchema>
