import { useGetCostumesQuery } from '@/apis/costume/hooks/use-costume-request'
import type { ICostume } from '@/apis/costume/types'
import { ColumnViewOptions } from '@/components/shared/data-grid/components/column-view-options'
import GlobalFilterInput from '@/components/shared/data-grid/components/global-filter-input'
import { Button } from '@/components/ui/button'
import type { Table } from '@tanstack/react-table'
import { RefreshCw } from 'lucide-react'
import React from 'react'

const CostumeTableToolbar: React.FC<{ table: Table<ICostume> }> = ({ table }) => {
  const { refetch, isRefetching } = useGetCostumesQuery()

  return (
    <div className="flex gap-1 items-center">
      <GlobalFilterInput table={table} />
      <div className="ml-auto">
        <ColumnViewOptions />
      </div>
      <Button variant="outline" disabled={isRefetching} onClick={() => refetch()}>
        <RefreshCw aria-current={isRefetching} className={'aria-current:animate-spin'} /> Tải lại
      </Button>
    </div>
  )
}

export default CostumeTableToolbar
