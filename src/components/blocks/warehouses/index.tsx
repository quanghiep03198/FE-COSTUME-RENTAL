import type { TUpdateWarehouseValues } from '@/apis/warehouse/schemas/update-warehouse.schema'
import { createPubSubContext } from '@/contexts/pubsub-context'
import type React from 'react'
import WarehouseFormDialog from './warehouse-form-dialog'
import WarehouseTable from './warehouse-table'

export type TWarehousePubSubEventMap = {
  'warehouse:create': null
  'warehouse:update': TUpdateWarehouseValues
  'warehouse:delete': number
}

export const { PubSubProvider, usePubSub, usePubSubSubscription } =
  createPubSubContext<TWarehousePubSubEventMap>('WarehousePubSubContext')

const WarehouseTabContent: React.FC = () => {
  return (
    <PubSubProvider>
      <WarehouseTable />
      <WarehouseFormDialog />
    </PubSubProvider>
  )
}

export default WarehouseTabContent
