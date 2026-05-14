import { COSTUME_GENDER_LABEL_MAP, COSTUME_UNIT_LABEL_MAP } from '@/apis/costume/constants'
import { useGetCostumeInventoryQuery } from '@/apis/inventory/hooks/use-costume-inventory-request'
import type { ICostumeInventory } from '@/apis/inventory/types/costume'
import { formatCurrency } from '@/common/helpers/format-intl'
import { getImageUrl } from '@/common/helpers/get-image-url'
import { DataGrid } from '@/components/shared/data-grid'
import { fuzzySort } from '@/components/shared/data-grid/utils'
import Image from '@/components/shared/image'
import { Badge } from '@/components/ui/badge'
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'
import { useHydrated } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import React, { useMemo } from 'react'

const CostumeInventoryMasterTable: React.FC = () => {
  const { data, isLoading } = useGetCostumeInventoryQuery()
  const hyderated = useHydrated()

  const columnHelper = createColumnHelper<ICostumeInventory>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Trang phục',
        size: 250,
        enableSorting: true,
        enableMultiSort: true,
        enableHiding: false,
        sortingFn: fuzzySort,
        cell: ({ row }) => {
          const costumeName = row.original.name
          const image = row.original.images[0]?.dest
          const color = row.original.color
          return (
            <Item size="sm" className="p-0 flex-nowrap!">
              <ItemMedia>
                <Image src={getImageUrl(image)} className="size-16 rounded" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="line-clamp-1">{costumeName}</ItemTitle>
                <div className="inline-flex items-center gap-x-2">
                  <ItemDescription>Màu sắc:</ItemDescription>
                  <div style={{ backgroundColor: color.hex }} className="size-4 rounded-full" />
                </div>
              </ItemContent>
            </Item>
          )
        },
      }),
      columnHelper.accessor('inventory_condition.code', {
        header: 'Tình trạng',
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
      columnHelper.accessor('category.name', {
        id: 'category.name',
        header: 'Danh mục',
        size: 150,
        enableColumnFilter: true,
        enableGlobalFilter: true,
        filterFn: 'fuzzy',
      }),
      columnHelper.accessor('original_rental_price_per_day', {
        header: 'Giá thuê gốc (1 ngày)',
        cell: ({ getValue }) => formatCurrency(getValue()),
      }),
      columnHelper.accessor('current_rental_price_per_day', {
        header: 'Giá thuê hiện tại (1 ngày)',
        cell: ({ getValue }) => formatCurrency(getValue()),
      }),
      columnHelper.accessor('gender', {
        header: 'Giới tính',
        size: 100,
        cell: ({ getValue }) => {
          const value = COSTUME_GENDER_LABEL_MAP.get(getValue())
          return <Badge>{value}</Badge>
        },
      }),
      columnHelper.accessor('unit', {
        header: 'Đơn vị',
        size: 100,
        cell: ({ getValue }) => COSTUME_UNIT_LABEL_MAP.get(getValue()),
      }),
      columnHelper.display({
        id: 'total_qty',
        header: 'Tổng số lượng',
        cell: ({ row }) => {
          const items = row.original.details
          const totalQty = items.length
          return totalQty
        },
      }),
    ],
    []
  )

  return (
    <DataGrid
      columns={columns}
      data={data ?? []}
      loading={isLoading}
      virtualizerOptions={{ estimateSize: 75 }}
      containerProps={{ className: 'h-[calc(100vh-12rem)]' }}
    />
  )
}

export default CostumeInventoryMasterTable
