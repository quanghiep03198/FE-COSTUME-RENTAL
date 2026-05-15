import type { CostumeSize } from '@/apis/costume/constants'
import type { ICostume } from '@/apis/costume/types'
import type { IWarehouse } from '@/apis/warehouse/types'
import type { ItemType } from '@/common/constants/enums'
import type { InventoryItemStatus } from '../constants'
import type { IInventoryCondition } from './condition'

export interface ICostumeInventoryItem extends IBaseEntity {
  sku: string
  size: CostumeSize
  status: InventoryItemStatus
  warehouse: Pick<IWarehouse, 'id' | 'name'>
}

export interface ICostumeInventoryEntity extends IBaseEntity {
  sku: string
  item_id: number
  item_type: ItemType
  inventory_condition: IInventoryCondition
  warehouse_id: number
  status: InventoryItemStatus
  size: CostumeSize
}

export interface ICostumeInventory extends Pick<
  ICostume,
  'id' | 'sizes' | 'name' | 'slug' | 'color' | 'gender' | 'category' | 'images' | 'unit'
> {
  inventory_condition: IInventoryCondition
  item_type: ItemType
  original_rental_price_per_day: number
  current_rental_price_per_day: number
  details: ICostumeInventoryItem[]
}
