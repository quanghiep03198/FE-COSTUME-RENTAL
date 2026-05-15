import { authMiddleware } from '@/middlewares/auth.middleware'
import { requestMiddleware } from '@/middlewares/request.middleware'
import { createServerFn } from '@tanstack/react-start'
import { importInventorySchema } from '../schemas/import-inventory.schema'
import { updateInventoryItemConditionSchema } from '../schemas/inventory-item-condition.schema'
import type { IInventoryCondition } from '../types/condition'
import type { ICostumeInventory } from '../types/costume'

export const getInventoryConditionsRpc = createServerFn({ method: 'GET' })
  .middleware([requestMiddleware])
  .handler(async ({ context }) => {
    return await context.request<IInventoryCondition[]>({ url: '/inventory/conditions', method: 'GET' })
  })

export const getCostumeInventoryRpc = createServerFn({ method: 'GET' })
  .middleware([authMiddleware, requestMiddleware])
  .handler(async ({ context }) => {
    return await context.request<ICostumeInventory[]>({ url: '/inventory/costumes', method: 'GET' })
  })

export const getPropsInventoryRpc = createServerFn({ method: 'GET' })
  .middleware([authMiddleware, requestMiddleware])
  .handler(async ({ context }) => {
    return await context.request<ICostumeInventory[]>({ url: '/inventory/props', method: 'GET' })
  })

export const importInventoryRpc = createServerFn({ method: 'POST' })
  .middleware([authMiddleware, requestMiddleware])
  .inputValidator(importInventorySchema)
  .handler(async ({ context, data }) => {
    return await context.request({
      url: '/inventory/import',
      method: 'POST',
      data: {
        item_id: data.item.id,
        item_type: data.item_type,
        inventory_condition_id: data.inventory_condition.id,
        size: data.size?.value,
        quantity: data.quantity,
        warehouse_id: data.warehouse.id,
      },
    })
  })

export const updateInventoryItemConditionRpc = createServerFn({ method: 'POST' })
  .inputValidator(updateInventoryItemConditionSchema)
  .middleware([authMiddleware, requestMiddleware])
  .handler(async ({ context, data: { sku, inventory_condition } }) => {
    return await context.request({
      url: `/inventory/condition/${sku}`,
      method: 'PATCH',
      data: { inventory_condition_id: inventory_condition.id },
    })
  })
