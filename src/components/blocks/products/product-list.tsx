import { useGetCostumesQuery } from '@/apis/costume/hooks/use-costume-request'
import type { ICostume } from '@/apis/costume/types'
import { useGetPropsQuery } from '@/apis/equipment-props/hooks/use-equipment-props-request'
import type { IEquipmentProps } from '@/apis/equipment-props/types'
import type { TSearchProductValues } from '@/apis/product/schemas/product.schema'
import type { TProductCardData } from '@/apis/product/types'
import { ItemType } from '@/common/constants/enums'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Typography } from '@/components/ui/typography'
import { useWorkerFn } from '@/hooks/use-worker-fn'
import type { Group } from '@base-ui/react/internals/resolveValueLabel'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useDeepCompareEffect } from 'ahooks'
import { ArrowUpDownIcon } from 'lucide-react'
import { Fragment, useCallback, useState } from 'react'
import ProductCard from './product-card'

const sortOptions: Group<{ value: string; label: string }>[] = [
  {
    label: 'Tên',
    items: [
      { value: 'name:asc', label: 'Tên (A-Z)' },
      { value: 'name:desc', label: 'Tên (Z-A)' },
    ],
  },
  {
    label: 'Giá',
    items: [
      { value: 'price:asc', label: 'Giá (Thấp đến Cao)' },
      { value: 'price:desc', label: 'Giá (Cao đến Thấp)' },
    ],
  },
]

const ProductList: React.FC = () => {
  const search = useSearch({ from: '/_public-layout/products' })
  const navigate = useNavigate({ from: '/products' })
  const { data: costumes } = useGetCostumesQuery()
  const { data: equipmentProps } = useGetPropsQuery()

  const dataset = {
    [ItemType.COSTUME]: costumes,
    [ItemType.EQUIPMENT_PROPS]: equipmentProps,
  }

  const handleFilterAndSort = useCallback(
    (data: Array<ICostume> | Array<IEquipmentProps>, search: TSearchProductValues) => {
      if (!Array.isArray(data)) return []

      console.log(data)

      let filteredData: Array<TProductCardData> = data.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.images[0]?.url,
        rental_price_per_day: item.rental_price_per_day,
        category: item.category.slug,
        slug: item.slug,
        type: item.category.type,
        hashtags: item.hashtags,
        gender: (item as ICostume).gender,
        color: (item as ICostume)?.color,
        sizes: (item as ICostume)?.sizes,
      }))

      if (search.q) {
        filteredData = filteredData.filter((item) => item.name.toLowerCase().includes(search.q!.toLowerCase()))
      }

      if (search['category_slug:eq']) {
        filteredData = filteredData.filter((item) => item.category === search['category_slug:eq'])
      }

      if (
        typeof search['rental_price_per_day:gte'] === 'number' &&
        typeof search['rental_price_per_day:lte'] === 'number'
      )
        return filteredData.filter(
          (item) =>
            item.rental_price_per_day >= search['rental_price_per_day:gte']! &&
            item.rental_price_per_day <= search['rental_price_per_day:lte']!
        )

      if (search['color:eq']) filteredData = filteredData.filter((item) => item.color?.hex === search['color:eq'])

      if (typeof search['gender:eq']) return filteredData.filter((item) => item.gender)

      if (typeof search['size:in'] === 'string' && search['size:in'].split(',').length > 0)
        filteredData = filteredData.filter((item) =>
          item.sizes?.some((size) => search['size:in']?.split(',').includes(size))
        )

      if (search['_sort']) {
        const [sortField, sortOrder] = search['_sort'].split(':')
        filteredData.sort((a, b) => {
          if (sortField === 'name') {
            return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
          } else if (sortField === 'price') {
            return sortOrder === 'asc'
              ? a.rental_price_per_day - b.rental_price_per_day
              : b.rental_price_per_day - a.rental_price_per_day
          }
          return 0
        })
      }

      return filteredData
    },
    []
  )

  const { execute: processFilterAndSort, isPending } = useWorkerFn(handleFilterAndSort)

  const [products, setProducts] = useState<Array<TProductCardData>>([])

  useDeepCompareEffect(() => {
    processFilterAndSort(dataset[search.item_type!], search).then((prods) =>
      setProducts(prods as Array<TProductCardData>)
    )
  }, [search, dataset])

  return (
    <div className="space-y-6 flex flex-col">
      <nav className="space-y-3">
        <div className="flex items-center justify-between">
          <Typography color="muted">{products.length} sản phẩm</Typography>
          <Select
            {...(search['_sort'] && {
              value: sortOptions.flatMap((group) => group.items).find((option) => option.value === search['_sort']),
            })}
            items={sortOptions}
            onValueChange={(option: Record<'label' | 'value', string> | null) => {
              if (option) {
                return navigate({ search: (prev) => ({ ...prev, _sort: option.value! }) })
              }
            }}
            itemToStringLabel={(item: Record<'label' | 'value', string>) => item.label}
            itemToStringValue={(item: Record<'label' | 'value', string>) => item.value}
            isItemEqualToValue={(itemValue, value) => itemValue.value === value.value}
          >
            <SelectTrigger>
              <ArrowUpDownIcon />
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent className="w-fit h-fit" side="bottom">
              {sortOptions.map((group, index) => (
                <Fragment key={index.toString()}>
                  <SelectGroup key={index}>
                    <SelectLabel>{String(group.label)}</SelectLabel>
                    {group.items.map((option) => (
                      <SelectItem key={option.value} value={option}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  {index < sortOptions.length - 1 && <SelectSeparator />}
                </Fragment>
              ))}
            </SelectContent>
          </Select>
        </div>
      </nav>

      <div
        aria-current={isPending}
        className="flex-1 h-[calc(100vh-var(--header-top-height)-var(--header-bottom-height)-96px)] aria-current:grid hidden place-content-center"
      >
        <Spinner />
      </div>

      <div
        aria-current={!isPending}
        className="hidden flex-1 aria-current:grid grid-cols-2 md:max-xl:grid-cols-2 xl:grid-cols-4 gap-10"
      >
        {products.map((product) => (
          <ProductCard key={product.slug} data={product} />
        ))}
      </div>
    </div>
  )
}

export default ProductList
