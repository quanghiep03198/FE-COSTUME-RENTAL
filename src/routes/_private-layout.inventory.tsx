import { inventoryPageSearchSchema } from '@/apis/inventory/schemas/search.schema'
import { getWarehousesQueryOptions } from '@/apis/warehouse/hooks/use-warehouse-request'
import InventoryPage from '@/components/blocks/inventory'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_private-layout/inventory')({
  component: InventoryPage,
  validateSearch: inventoryPageSearchSchema,
  loader: async ({ context }) => {
    return await Promise.all([
      context.queryClient.ensureQueryData(getWarehousesQueryOptions()),
      // TODO: add prefetch costume & props inventory here
    ])
  },
})
