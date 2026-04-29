import { GET_PROPS_CATEGORY_QUERY_KEY, useGetCategoriesQuery } from '@/apis/category/hooks/use-category-request'
import type { ICostume } from '@/apis/costume/types'
import { useGetPropsQuery } from '@/apis/equipment-props/hooks/use-equipment-props-request'
import { ColumnViewOptions } from '@/components/shared/data-grid/components/column-view-options'
import GlobalFilterInput from '@/components/shared/data-grid/components/global-filter-input'
import { DataTableFacetedFilter } from '@/components/shared/data-grid/components/table-faceted-filter'
import { Button } from '@/components/ui/button'
import type { Table } from '@tanstack/react-table'
import { RefreshCw } from 'lucide-react'
import React, { useMemo } from 'react'

const EquipmentPropsTableToolbar: React.FC<{ table: Table<ICostume> }> = ({ table }) => {
  const { refetch, isRefetching } = useGetPropsQuery()

  const { data: categories } = useGetCategoriesQuery(GET_PROPS_CATEGORY_QUERY_KEY)

  const categoryOptions = useMemo(() => {
    return !Array.isArray(categories) ? [] : categories.map((cate) => ({ label: cate.name, value: cate.name }))
  }, [categories])

  return (
    <div className="flex gap-1 items-center">
      <GlobalFilterInput table={table} />
      <DataTableFacetedFilter column={table.getColumn('category.name')} title="Danh mục" options={categoryOptions} />
      <div className="ml-auto">
        <ColumnViewOptions />
      </div>
      <Button variant="outline" disabled={isRefetching} onClick={() => refetch()}>
        <RefreshCw aria-current={isRefetching} className={'aria-current:animate-spin'} /> Tải lại
      </Button>
    </div>
  )
}

export default EquipmentPropsTableToolbar
