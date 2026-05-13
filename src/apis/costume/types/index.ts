import type { ICategory } from '@/apis/category/types'
import type { IImage } from '@/apis/image/types'
import type { TColorPateItem } from '@/common/constants/const'
import type { CostumeGender, CostumeSize, CostumeUnit } from '../constants'

export type TCostumeSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL'

export interface ICostume extends IBaseEntity {
  name: string
  slug: string
  category_id: number
  category: ICategory
  color: TColorPateItem
  sizes: Array<CostumeSize>
  unit: CostumeUnit
  gender: CostumeGender
  images: Array<IImage>
  rental_price_per_day: number
  description: string
  hashtags: Array<string>
}
