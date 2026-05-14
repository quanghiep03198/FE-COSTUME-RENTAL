import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getCostumeInventoryRpc } from '../rpc/costume-inventory.rpc'

export const GET_COSTUME_INVENTORY_QUERY_KEY = 'get_costume_inventory'

export const getCostumeInventoryQueryOptions = () => {
  return queryOptions({
    queryKey: [GET_COSTUME_INVENTORY_QUERY_KEY],
    queryFn: () => getCostumeInventoryRpc(),
  })
}

export const useGetCostumeInventoryQuery = () => {
  return useSuspenseQuery(getCostumeInventoryQueryOptions())
}
