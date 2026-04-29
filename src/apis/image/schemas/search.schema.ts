import z from 'zod'
import { ImageMimeType } from '../constants'

export const searchImagesSchema = z
  .object({
    'mime_type:eq': z.nativeEnum(ImageMimeType).nullish(),
    created_by: z.number().nullish(),
    'created_at:lte': z.coerce.date().nullish(),
    'category_id:eq': z.number().nullish(),
  })
  .nullish()

export type TSearchImagesValues = z.infer<typeof searchImagesSchema>
