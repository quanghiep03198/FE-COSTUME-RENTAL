import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useNavigate, useSearch } from '@tanstack/react-router'
import type { JSX } from 'react'
import WarehouseTabContent from '../warehouses'

const tabs: Array<{
  value: 'all-warehouses' | 'costume-warehouse' | 'props-warehouse'
  label: string
  content: JSX.Element
}> = [
  {
    value: 'all-warehouses',
    label: 'Tất cả kho',
    content: <WarehouseTabContent />,
  },
  {
    value: 'costume-warehouse' as const,
    label: 'Kho trang phục',
    content: <>Kho trang phục</>,
  },
  {
    value: 'props-warehouse',
    label: 'Kho đạo cụ',
    content: <>Kho đạo cụ</>,
  },
]

const InventoryPage: React.FC = () => {
  const tabValue = useSearch({
    structuralSharing: false,
    from: '/_private-layout/inventory',
    select: (state) => state.tab,
  })

  const navigate = useNavigate({ from: '/inventory' })

  return (
    <Tabs value={tabValue}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger value={tab.value} onClick={() => navigate({ search: { tab: tab.value } })}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default InventoryPage
