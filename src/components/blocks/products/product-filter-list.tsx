import { useGetCategoriesQuery } from '@/apis/category/hooks/use-category-request'
import { useGetCostumesQuery } from '@/apis/costume/hooks/use-costume-request'
import type { ICostume } from '@/apis/costume/types'
import { useGetPropsQuery } from '@/apis/equipment-props/hooks/use-equipment-props-request'
import type { IEquipmentProps } from '@/apis/equipment-props/types'
import { ItemType } from '@/common/constants/enums'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Typography } from '@/components/ui/typography'

import { useNavigate, useSearch } from '@tanstack/react-router'
import { omit } from 'lodash-es'
import { SearchIcon } from 'lucide-react'
import { useMemo } from 'react'

const useGetRentalPriceRange = (products: Array<ICostume | IEquipmentProps>) => {
  const maxPrice = useMemo(
    () => (Array.isArray(products) ? Math.max(...products.map((item) => item.rental_price_per_day)) : 0),
    [products]
  )
  const minPrice = useMemo(
    () => (Array.isArray(products) ? Math.min(...products.map((item) => item.rental_price_per_day)) : 0),
    [products]
  )

  const roundDown = (value: number, step: number) => Math.floor(value / step) * step
  const roundUp = (value: number, step: number) => Math.ceil(value / step) * step

  const STEP = 20000
  const roundedMin = roundDown(minPrice, STEP)
  const roundedMax = roundUp(maxPrice, STEP)

  return useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return []
    const ranges = []
    for (let start = roundedMin; start < roundedMax; start += STEP) {
      const end = Math.min(start + STEP, roundedMax)
      ranges.push({ min: start, max: end })
    }
    return ranges
  }, [roundedMin, roundedMax])
}

const ProductFilterList = () => {
  const search = useSearch({ from: '/_public-layout/san-pham' })
  const navigate = useNavigate({ from: '/san-pham' })

  const { data: categories } = useGetCategoriesQuery({ 'type:eq': search['item_type'] })
  const { data: costumes } = useGetCostumesQuery()
  const { data: equipmentProps } = useGetPropsQuery()

  const dataSet = {
    [ItemType.COSTUMES]: costumes,
    [ItemType.EQUIPMENT_PROPS]: equipmentProps,
  }

  const filteredPropertysCount = Object.keys(omit(search, ['item_type'])).length

  const categoriesSelected: number =
    typeof search['category_slug:in'] === 'string' ? search['category_slug:in'].split(',').length : 0

  const productRentalPriceRange = useGetRentalPriceRange(dataSet[search.item_type!])

  return (
    <div className="xl:h-[calc(100vh-var(--header-top-height)-var(--header-bottom-height))] overflow-y-auto scrollbar-none w-96 space-y-6">
      {/* Filter header */}
      <div className="flex justify-between items-center">
        <Typography variant="h3">Bộ lọc ({filteredPropertysCount})</Typography>
        <Button size="sm">Xóa lọc</Button>
      </div>

      {/* Filter input group */}
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon className="size-4" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Tìm giá trị lọc" type="search" />
      </InputGroup>

      {/**
       * * Filter list
       * --------------------------------------------------------------
       */}

      <Accordion multiple className="w-full" defaultValue={['item_type', 'category_slug:in']}>
        {/* Product type */}
        <AccordionItem value="item_type">
          <AccordionTrigger className="xl:text-base font-semibold">Loại sản phẩm</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              defaultValue={search.item_type}
              onValueChange={(value) => navigate({ search: (prev) => ({ ...prev, item_type: value }) })}
            >
              <Field orientation="horizontal">
                <RadioGroupItem value={ItemType.COSTUMES} id={ItemType.COSTUMES} />
                <FieldLabel htmlFor={ItemType.COSTUMES} className="font-normal">
                  Trang phục
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <RadioGroupItem value={ItemType.EQUIPMENT_PROPS} id={ItemType.EQUIPMENT_PROPS} />
                <FieldLabel htmlFor={ItemType.EQUIPMENT_PROPS} className="font-normal">
                  Đạo cụ
                </FieldLabel>
              </Field>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
        {/* Categories */}
        <AccordionItem value="category_slug:in" className="border-none">
          <AccordionTrigger className="xl:text-base font-semibold">Danh mục ({categoriesSelected})</AccordionTrigger>
          <AccordionContent>
            {!Array.isArray(categories) || categories.length === 0 ? (
              <Typography variant="small" color="muted">
                Chưa có danh mục nào
              </Typography>
            ) : (
              <FieldGroup>
                {categories.map((cate) => (
                  <Field orientation={'horizontal'}>
                    <Checkbox id={cate.slug} value={cate.slug} name={cate.slug} defaultChecked />
                    <FieldLabel htmlFor={cate.slug} className="text-sm">
                      {cate.name}
                    </FieldLabel>
                  </Field>
                ))}
              </FieldGroup>
            )}
          </AccordionContent>
        </AccordionItem>
        {/* Pricing */}
        <AccordionItem value="rental_price_per_day:between" className="border-none">
          <AccordionTrigger className="xl:text-base font-semibold">Giá thuê (VND/ngày)</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              onValueChange={(value) =>
                navigate({
                  search: (prev) => {
                    const priceRange = value ? JSON.parse(value) : null
                    if (!priceRange) return omit(prev, ['rental_price_per_day:lte', 'rental_price_per_day:gte'])
                    return {
                      ...prev,
                      'rental_price_per_day:gte': priceRange.min,
                      'rental_price_per_day:lte': priceRange.max,
                    }
                  },
                })
              }
            >
              <Field orientation="horizontal">
                <RadioGroupItem value={null} id={'all-price'} />
                <FieldLabel htmlFor={'all-price'} className="font-normal">
                  Tất cả giá
                </FieldLabel>
              </Field>
              {Array.isArray(productRentalPriceRange) &&
                productRentalPriceRange.map((range, index) => (
                  <Field orientation="horizontal" key={index}>
                    <RadioGroupItem value={JSON.stringify(range)} id={`${range.min}-${range.max}`} />
                    <FieldLabel htmlFor={`${range.min}-${range.max}`} className="text-sm">
                      {range.min.toLocaleString()} - {range.max.toLocaleString()}
                    </FieldLabel>
                  </Field>
                ))}
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default ProductFilterList
