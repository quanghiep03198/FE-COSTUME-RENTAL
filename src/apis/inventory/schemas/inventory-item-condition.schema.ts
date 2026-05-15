import { z } from 'zod'

export const updateInventoryItemConditionSchema = z.object({
  sku: z.string({ message: 'Thiếu SKU của sản phẩm' }),
  inventory_condition: z.object(
    { id: z.number().min(1), label: z.string() },
    { message: 'Vui lòng tình trạng sản phẩm' }
  ),
})

export type TUpdateInventoryItemConditionValues = z.infer<typeof updateInventoryItemConditionSchema>
