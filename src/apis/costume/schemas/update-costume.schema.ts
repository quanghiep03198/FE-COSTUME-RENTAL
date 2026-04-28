import z from 'zod'
import type { ICostume } from '../types'
import { createCostumeReqSchema, createCostumeSchema } from './create-costume.schema'

export const updateCostumeSchema = createCostumeSchema.partial().extend({ id: z.number() })

export const updateCostumeReqSchema = createCostumeReqSchema.partial().extend({ id: z.number() })

export type TUpdateCostumeSchema = typeof updateCostumeSchema

export type TUpdateCostumeValues = z.infer<TUpdateCostumeSchema> & Pick<ICostume, 'id'>

export type TUpdateCostumeReqValues = z.infer<typeof updateCostumeReqSchema>
