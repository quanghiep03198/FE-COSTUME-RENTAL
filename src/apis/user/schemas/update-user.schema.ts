import { z, type infer as Infer } from 'zod'
import { createUserSchema } from './create-user.schema'

export const updateUserSchema = createUserSchema.partial().omit({ employee: true }).extend({ id: z.number() })

export type TUpdateUserSchema = typeof updateUserSchema

export type TUpdateUserValues = Infer<TUpdateUserSchema>
