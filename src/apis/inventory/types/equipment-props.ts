import type { IEquipmentProps } from '@/apis/equipment-props/types'
import type { ItemType } from '@/common/constants/enums'
import type { IInventoryCondition } from './condition'

export interface IEquipmentPropsInventory extends Pick<
  IEquipmentProps,
  'id' | 'name' | 'category' | 'images' | 'unit'
> {
  inventory_condition: IInventoryCondition
  item_type: ItemType
  original_rental_price_per_day: number
  current_rental_price_per_day: number
}
