import type { infer as Infer } from 'zod'
import { createContractSchema } from './create-contract.schema'

export const updateContractSchema = createContractSchema.partial()

export type TUpdateContractSchema = typeof updateContractSchema

export type TUpdateContractValues = Infer<typeof updateContractSchema>
