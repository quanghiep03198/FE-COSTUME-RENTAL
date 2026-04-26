import { formatCurrency } from '@/common/helpers/format-intl'
import z from 'zod'
import { CostumeGender, CostumeUnit } from '../constants'

export const createCostumeSchema = z.object({
  name: z
    .string({ message: 'Tên danh mục không được để trống' })
    .nonempty({ message: 'Tên danh mục không được để trống' }),
  category_id: z.object({ id: z.number(), name: z.string() }, { message: 'Vui lòng chọn danh mục trang phục' }),
  color: z.string({ message: 'Màu sắc không được để trống' }).nonempty({ message: 'Màu sắc không được để trống' }),
  sizes: z
    .array(
      z.object(
        {
          label: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']),
          value: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']),
          sortOrder: z.number(),
        },
        { message: 'Kích cỡ không hợp lệ' }
      )
    )
    .nonempty({ message: 'Vui lòng chọn ít nhất một kích cỡ' }),
  gender: z.nativeEnum(CostumeGender, { message: 'Giới tính không hợp lệ' }),
  images: z
    .array(z.number({ message: 'Vui lòng chọn hình ảnh cho trang phục' }))
    .nonempty({ message: 'Vui lòng chọn hình ảnh cho trang phục' }),
  rental_price_per_day: z
    .number({ message: 'Hãy nhập giá thuê theo ngày cho trang phục' })
    .min(10_000, { message: `Giá thuê theo ngày phải lớn hơn hoặc bằng ${formatCurrency(10_000)}` }),
  description: z.string({ message: 'Mô tả không được để trống' }).nonempty({ message: 'Mô tả không được để trống' }),
  unit: z.nativeEnum(CostumeUnit, { message: 'Đơn vị không hợp lệ' }),
  hashtags: z.array(z.string()).nonempty(),
})

export type TCreateCostumeSchema = typeof createCostumeSchema

export type TCreateCostumeValues = z.infer<TCreateCostumeSchema>
