import type { CostumeGender, CostumeSize } from '@/apis/costume/constants'
import type { IImage } from '@/apis/image/types'
import type { ItemType } from '@/common/constants/enums'

export interface IProduct {
  id: number
  name: string
  rental_price_per_day: number
  image: string
  images?: Array<IImage>
  type: ItemType
  slug: string
  hashtags: string[]
  color?: string
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
