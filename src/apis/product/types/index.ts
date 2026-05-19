import type { ItemType } from '@/common/constants/enums'

export type TProduct = {
  id: number
  name: string
  price: number
  image: string
  type: ItemType
  slug: string
  hashtags: string[]
}
