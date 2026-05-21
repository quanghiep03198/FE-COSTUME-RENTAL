import type { ICategory } from '@/apis/category/types'
import type { CostumeGender, CostumeSize } from '@/apis/costume/constants'
import type { IImage } from '@/apis/image/types'
import type { TColorPateItem } from '@/common/constants/const'
import type { ItemType } from '@/common/constants/enums'

export interface IProduct {
  id: number
  name: string
  rental_price_per_day: number
  image: string
  images: Array<IImage>
  type: ItemType
  slug: string
  category?: ICategory
  hashtags: string[]
  color?: TColorPateItem
  sizes?: CostumeSize[]
  gender: CostumeGender | null
  description: string
  inventory: {
    total_qty: number
    available_qty: number
    is_available: boolean
    by_size: Array<{
      size: CostumeSize
      total_qty: number
      available_qty: number
      is_available: boolean
    }>
  }
}

export type TProductCardData = Pick<
  IProduct,
  'id' | 'name' | 'image' | 'type' | 'rental_price_per_day' | 'color' | 'gender' | 'sizes' | 'slug'
> & { category: string }
