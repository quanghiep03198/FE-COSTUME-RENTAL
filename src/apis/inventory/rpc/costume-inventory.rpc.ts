import { authMiddleware } from '@/middlewares/auth.middleware'
import { requestMiddleware } from '@/middlewares/request.middleware'
import { createServerFn } from '@tanstack/react-start'
import type { ICostumeInventory } from '../types/costume'

export const getCostumeInventoryRpc = createServerFn({ method: 'GET' })
  .middleware([authMiddleware, requestMiddleware])
  .handler(async ({ context }) => {
    return await context.request<ICostumeInventory[]>({ url: '/inventory/costumes', method: 'GET' })
  })
