import { z } from 'zod'
import { createWarehouseSchema } from './create-warehouse.schema'

export const updateWarehouseSchema = z.object(createWarehouseSchema.shape).partial().extend({ id: z.number() })

export type TUpdateWarehouseSchema = typeof updateWarehouseSchema

export type TUpdateWarehouseValues = z.infer<TUpdateWarehouseSchema>
