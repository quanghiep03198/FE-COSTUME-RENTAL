import { type infer as Infer } from 'zod'
import { createEmployeeSchema } from './create-employee.schema'

export const updateEmployeeSchema = createEmployeeSchema.partial()

export type TUpdateEmployeeSchema = typeof updateEmployeeSchema

export type TUpdateEmployeeValues = Infer<TUpdateEmployeeSchema>
