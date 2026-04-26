import { type infer as Infer } from 'zod'
import { createUserSchema } from './create-user.schema'

export const updateUserSchema = createUserSchema.partial().omit({ employee_id: true })

export type TUpdateUserSchema = typeof updateUserSchema

export type TUpdateUserValues = Infer<TUpdateUserSchema>
