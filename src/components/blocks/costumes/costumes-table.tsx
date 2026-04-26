import { COSTUME_GENDER_LABEL_MAP, COSTUME_UNIT_LABEL_MAP } from '@/apis/costume/constants'
import { useGetCostumesQuery } from '@/apis/costume/hooks/use-costume-request'
import type { ICostume } from '@/apis/costume/types'
import { formatCurrency } from '@/common/helpers/format-intl'
import { getImageUrl } from '@/common/helpers/get-image-url'
import { DataGrid } from '@/components/shared/data-grid'
import { ROW_ACTIONS_COLUMN_ID } from '@/components/shared/data-grid/constants'
import { fuzzySort } from '@/components/shared/data-grid/utils'
import Image from '@/components/shared/image'
import { Badge } from '@/components/ui/badge'
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'
import { createColumnHelper } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import CostumeDropdownOptions from './costume-dropdown-options'
const CostumeTable: React.FC = () => {
  const { data, isLoading } = useGetCostumesQuery()

  const columnHelper = createColumnHelper<ICostume>()

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
                  <div style={{ backgroundColor: color }} className="size-4 rounded-full" />
                </div>
              </ItemContent>
            </Item>
          )
        },
      }),

      columnHelper.accessor('category.name', {
        header: 'Danh mục',
      }),
      columnHelper.accessor('rental_price_per_day', {
        header: 'Giá thuê theo ngày',
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
      columnHelper.accessor('sizes', {
        header: 'Cỡ',
        cell: ({ getValue }) => {
          const sizes = getValue()
          return (
            <div className="flex flex-wrap gap-1">
              {sizes?.map((size) => (
                <Badge key={size} variant={'outline'}>
                  {size}
                </Badge>
              ))}
            </div>
          )
        },
      }),
      columnHelper.accessor('hashtags', {
        header: 'Hashtag',
        cell: ({ getValue }) => {
          const hashtags = getValue()
          return (
            <div className="flex flex-wrap">
              {hashtags?.map((tag) => (
                <Badge key={tag} variant={'secondary'}>
                  <span className='before:content-["#"]'>{tag}</span>
                </Badge>
              ))}
            </div>
          )
        },
      }),
      columnHelper.display({
        id: ROW_ACTIONS_COLUMN_ID,
        header: '',
        size: 60,
        cell: CostumeDropdownOptions,
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
      containerProps={{
        style: {
          height: 'calc(var(--outlet-wrapper-height) - 8rem)',
        },
      }}
      toolbarProps={{ override: true, render: () => <></> }}
    />
  )
}

export default CostumeTable
