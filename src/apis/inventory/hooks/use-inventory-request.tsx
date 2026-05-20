import { ItemType } from '@/common/constants/enums'
import { queryOptions, useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { toast } from 'sonner'
import {
  getCostumeInventoryRpc,
  getInventoryConditionsRpc,
  getPropsInventoryRpc,
  importInventoryRpc,
  updateInventoryItemConditionRpc,
} from '../rpc'
import type { TImportInventoryValues } from '../schemas/import-inventory.schema'
import type { TUpdateInventoryItemConditionValues } from '../schemas/inventory-item-condition.schema'

export const GET_COSTUME_INVENTORY_QUERY_KEY = 'costume_inventory'

export const GET_PROPS_INVENTORY_QUERY_KEY = 'props_inventory'

export const GET_INVENTORY_CONDITIONS_QUERY_KEY = 'inventory_conditions'

export const getInventoryConditionQueryOptions = () => {
  return queryOptions({
    queryKey: [GET_INVENTORY_CONDITIONS_QUERY_KEY],
    queryFn: () => getInventoryConditionsRpc(),
  })
}

export const getCostumeInventoryQueryOptions = () => {
  return queryOptions({
    queryKey: [GET_COSTUME_INVENTORY_QUERY_KEY],
    queryFn: () => getCostumeInventoryRpc(),
  })
}

export const getPropsInventoryQueryOptions = () => {
  return queryOptions({
    queryKey: [GET_PROPS_INVENTORY_QUERY_KEY],
    queryFn: () => getPropsInventoryRpc(),
  })
}

export const useGetInventoryConditionsQuery = () => {
  return useSuspenseQuery(getInventoryConditionQueryOptions())
}

export const useGetCostumeInventoryQuery = () => {
  return useSuspenseQuery(getCostumeInventoryQueryOptions())
}

export const useGetPropsInventoryQuery = () => {
  return useSuspenseQuery(getPropsInventoryQueryOptions())
}

export const useImportInventoryMutation = (type: ItemType) => {
  const importInventoryFn = useServerFn(importInventoryRpc)

  const invalidates = (() => {
    switch (type) {
      case ItemType.COSTUME:
        return [[GET_COSTUME_INVENTORY_QUERY_KEY]]
      case ItemType.EQUIPMENT_PROPS:
        return [[GET_PROPS_INVENTORY_QUERY_KEY]]
      default:
        return []
    }
  })()

  return useMutation({
    meta: { invalidates },
    mutationFn: (data: TImportInventoryValues) => importInventoryFn({ data }),
  })
}

export const useUpdateInventoryItemConditionMutation = (type: ItemType) => {
  const updateInventoryItemConditionFn = useServerFn(updateInventoryItemConditionRpc)

  const invalidates = (() => {
    switch (type) {
      case ItemType.COSTUME:
        return [[GET_COSTUME_INVENTORY_QUERY_KEY]]
      case ItemType.EQUIPMENT_PROPS:
        return [[GET_PROPS_INVENTORY_QUERY_KEY]]
      default:
        return []
    }
  })()

  return useMutation({
    meta: { invalidates },
    mutationFn: (data: TUpdateInventoryItemConditionValues) => updateInventoryItemConditionFn({ data }),
    onSuccess: () => {
      toast.success('Nhập kho thành công')
    },
    onError: () => {
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau')
    },
  })
}
