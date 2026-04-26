import type { ItemType } from '@/common/constants/enums'

export interface ICategory extends IBaseEntity {
  name: string
  slug: string
  type: ItemType
}
