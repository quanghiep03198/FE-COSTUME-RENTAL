import { createPubSubContext } from '@/contexts/pubsub-context'
import type React from 'react'
import WarehouseTable from './warehouse-table'

export const { PubSubProvider, usePubSub, usePubSubSubscription } = createPubSubContext('WarehousePubSubContext')

const WarehouseTabContent: React.FC = () => {
  return (
    <PubSubProvider>
      <WarehouseTable />
    </PubSubProvider>
  )
}

export default WarehouseTabContent
