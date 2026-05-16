import { useGetPropsInventoryQuery } from '@/apis/inventory/hooks/use-inventory-request'
import type { IEquipmentPropsInventory } from '@/apis/inventory/types/equipment-props'
import { formatCurrency } from '@/common/helpers/format-intl'
import { getImageUrl } from '@/common/helpers/get-image-url'
import { DataGrid } from '@/components/shared/data-grid'
import { ROW_EXPANSION_COLUMN_ID } from '@/components/shared/data-grid/constants'
import { fuzzySort } from '@/components/shared/data-grid/utils'
import Image from '@/components/shared/image'
import { Tooltip } from '@/components/shared/tooltip'
import { Badge } from '@/components/ui/badge'
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item'
import { createColumnHelper } from '@tanstack/react-table'
import { ChevronDownIcon, ChevronRightIcon, ListCollapseIcon } from 'lucide-react'
import React, { useMemo } from 'react'

import PropsInventoryTableToolbar from './props-inventory-table-toolbar'

const PropsInventoryMasterTable: React.FC = () => {
  const { data, isLoading } = useGetPropsInventoryQuery()

  const columnHelper = createColumnHelper<IEquipmentPropsInventory>()

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: ROW_EXPANSION_COLUMN_ID,
        header: ({ table }) => (
          <Tooltip
            message="Thu gọn"
            triggerProps={{
              render: (
                <button
                  className="absolute inset-0 flex h-full w-full items-center justify-center text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  onClick={() => table.toggleAllRowsExpanded(false)}
                >
                  <ListCollapseIcon size={16} />
                </button>
              ),
            }}
          />
        ),
        size: 50,
        maxSize: 50,
        enableHiding: false,
        cell: ({ row, table }) => (
          <button
            className="absolute inset-0 flex h-full w-full items-center justify-center"
            onClick={() => {
              table.toggleAllRowsExpanded(false)
              row.toggleExpanded(!row.getIsExpanded())
            }}
          >
            {row.getIsExpanded() ? <ChevronDownIcon size={16} /> : <ChevronRightIcon size={16} />}
          </button>
        ),
      }),
      columnHelper.accessor('name', {
        header: 'Đạo cụ',
        minSize: 250,
        enableSorting: true,
        enableMultiSort: true,
        enableHiding: false,
        sortingFn: fuzzySort,
        cell: ({ row }) => {
          const costumeName = row.original.name
          const image = row.original.images?.[0]?.dest

          return (
            <Item size="sm" className="p-0 flex-nowrap">
              <ItemMedia>
                <Image src={getImageUrl(image)} className="size-14 rounded" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="line-clamp-1">{costumeName}</ItemTitle>
              </ItemContent>
            </Item>
          )
        },
      }),
      columnHelper.accessor('inventory_condition.code', {
        id: 'inventory_condition.code',
        header: 'Tình trạng',
        size: 150,
        enableColumnFilter: true,
        enableGlobalFilter: false,
        enableResizing: true,
        filterFn: 'arrIncludesSome',
        cell: ({ row }) => {
          return (
            <Badge variant="outline">
              <div
                className="size-1.5 rounded-full"
                style={{
                  backgroundColor: row.original.inventory_condition.badge_color,
                }}
              />{' '}
              {row.original.inventory_condition.label}
            </Badge>
          )
        },
      }),
      columnHelper.accessor('category.id', {
        id: 'category.id',
        header: 'Danh mục',
        size: 200,
        enableColumnFilter: true,
        enableGlobalFilter: false,
        enableResizing: true,
        filterFn: 'arrIncludesSome',
        cell: ({ row }) => row.original.category.name,
      }),
      columnHelper.accessor('original_rental_price_per_day', {
        header: 'Giá thuê gốc',
        enableSorting: true,
        enableColumnFilter: false,
        enableGlobalFilter: false,
        size: 200,
        cell: ({ getValue }) => formatCurrency(getValue()) + ' / ngày',
      }),
      columnHelper.accessor('current_rental_price_per_day', {
        header: 'Giá thuê hiện tại',
        enableSorting: true,
        enableColumnFilter: false,
        enableGlobalFilter: false,
        size: 200,
        cell: ({ getValue }) => formatCurrency(getValue()) + ' / ngày',
      }),

      columnHelper.accessor('unit', {
        header: 'Đơn vị',
        size: 100,
      }),
    ],
    []
  )

  return (
    <DataGrid
      columns={columns}
      data={data ?? []}
      loading={isLoading}
      virtualizerOptions={{ estimateSize: 80 }}
      enableExpanding
      containerProps={{
        className:
          'xxl:h-[calc(var(--outlet-wrapper-height)-4rem)] h-96 md:max-xxl:h-[calc(var(--outlet-wrapper-height)-8rem)] [&_table]:table-fixed',
      }}
      toolbarProps={{
        override: true,
        render: PropsInventoryTableToolbar,
      }}
    />
  )
}

export default PropsInventoryMasterTable
