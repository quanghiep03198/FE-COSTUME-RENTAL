import { useGetPropsQuery } from '@/apis/equipment-props/hooks/use-equipment-props-request'
import type { IEquipmentProps } from '@/apis/equipment-props/types'
import { formatCurrency } from '@/common/helpers/format-intl'
import { getImageUrl } from '@/common/helpers/get-image-url'
import { DataGrid } from '@/components/shared/data-grid'
import { ROW_ACTIONS_COLUMN_ID } from '@/components/shared/data-grid/constants'
import { fuzzySort } from '@/components/shared/data-grid/utils'
import EllipsisList from '@/components/shared/ellipsis-list'
import Image from '@/components/shared/image'
import { Badge } from '@/components/ui/badge'
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item'
import { createColumnHelper } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import EquipmentPropsDropdownOptions from './equipment-props-dropdown-options'
import EquipmentPropsTableToolbar from './equipment-props-table-toolbar'
const CostumeTable: React.FC = () => {
  const { data, isLoading } = useGetPropsQuery()

  const columnHelper = createColumnHelper<IEquipmentProps>()

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
          const image = row.original?.images?.[0]?.dest

          return (
            <Item size="sm" className="p-0 flex-nowrap!">
              <ItemMedia>
                <Image src={getImageUrl(image)} className="size-16 rounded" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="line-clamp-1">{costumeName}</ItemTitle>
              </ItemContent>
            </Item>
          )
        },
      }),

      columnHelper.accessor('category.name', {
        id: 'category.name',
        header: 'Danh mục',
        enableColumnFilter: true,
        enableGlobalFilter: true,
        filterFn: 'fuzzy',
      }),
      columnHelper.accessor('rental_price_per_day', {
        header: 'Giá thuê theo ngày',
        enableSorting: true,
        enableMultiSort: true,
        enableHiding: false,
        cell: ({ getValue }) => formatCurrency(getValue()),
      }),
      columnHelper.accessor('unit', {
        header: 'Đơn vị',
        size: 100,
      }),

      columnHelper.accessor('hashtags', {
        header: 'Hashtag',
        cell: ({ getValue }) => (
          <EllipsisList
            data={getValue()}
            threshhold={1}
            template={(item) => (
              <Badge variant="outline" className='before:content-["#"]'>
                {item.data}
              </Badge>
            )}
          />
        ),
      }),
      columnHelper.display({
        id: ROW_ACTIONS_COLUMN_ID,
        header: '',
        size: 60,
        enableHiding: false,
        cell: EquipmentPropsDropdownOptions,
      }),
    ],
    []
  )

  return (
    <DataGrid
      data={data}
      columns={columns}
      loading={isLoading}
      virtualizerOptions={{ estimateSize: 80 }}
      manualSorting={false}
      enableSorting={true}
      manualFiltering={false}
      enableColumnFilters={true}
      enableMultiSort={true}
      isMultiSortEvent={() => true}
      containerProps={{
        className:
          'xxl:h-[calc(var(--outlet-wrapper-height)-4rem)] h-96 md:max-xxl:h-[calc(var(--outlet-wrapper-height)-8rem)]',
      }}
      toolbarProps={{
        override: true,
        render: EquipmentPropsTableToolbar,
      }}
    />
  )
}

export default CostumeTable
