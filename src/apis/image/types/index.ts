import type { ICategory } from '@/apis/category/types'

export type TMimeType = `image/${'jpeg' | 'jpg' | 'png' | 'webp'}`

export type TImageMetadata = {
  file_name: string
  size: number
  dest: string
  mime_type: TMimeType
}

export interface IImage extends IBaseEntity, TImageMetadata {
  category_id: number
  category: ICategory
}
