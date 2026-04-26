import { ItemType } from '@/common/constants/enums'
import z from 'zod'

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục không được để trống'),
  type: z.nativeEnum(ItemType, {
    errorMap: () => ({ message: 'Loại danh mục không hợp lệ' }),
  }),
})

export type TCreateCategorySchema = typeof createCategorySchema

export type TCreateCategoryValues = z.infer<TCreateCategorySchema>
