import z from 'zod'
import type { ICategory } from '../types'
import { createCategorySchema } from './create-category.schema'

export const updateCategorySchema = createCategorySchema.partial()

export type TUpdateCategorySchema = typeof updateCategorySchema

export type TUpdateCategoryValues = z.infer<TUpdateCategorySchema> & Pick<ICategory, 'id'>
