import { useGetCategoriesQuery } from '@/apis/category/hooks/use-category-request'
import { COSTUME_GENDER_OPTIONS, SIZE_RUN } from '@/apis/costume/constants'
import { useGetCostumesQuery } from '@/apis/costume/hooks/use-costume-request'
import type { ICostume } from '@/apis/costume/types'
import { useGetPropsQuery } from '@/apis/equipment-props/hooks/use-equipment-props-request'
import type { IEquipmentProps } from '@/apis/equipment-props/types'
import { COLOR_PALETTE } from '@/common/constants/const'
import { ItemType } from '@/common/constants/enums'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Typography } from '@/components/ui/typography'

import { useNavigate, useSearch } from '@tanstack/react-router'
import { omit, pick } from 'lodash-es'
import { SearchIcon, XIcon } from 'lucide-react'
import { Activity, useEffect, useMemo, useState } from 'react'

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

  const STEP = 100000
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
  const search = useSearch({ from: '/_public-layout/products' })
  const navigate = useNavigate({ from: '/products' })

  const { data: categories } = useGetCategoriesQuery({ 'type:eq': search['item_type'] })
  const { data: costumes } = useGetCostumesQuery()
  const { data: equipmentProps } = useGetPropsQuery()

  const dataSet = {
    [ItemType.COSTUME]: costumes,
    [ItemType.EQUIPMENT_PROPS]: equipmentProps,
  }

  const filteredPropertysCount = Object.keys(omit(search, ['item_type'])).length

  const productRentalPriceRange = useGetRentalPriceRange(dataSet[search.item_type!])

  return (
    <div className="xl:h-[calc(100vh-var(--header-top-height)-var(--header-bottom-height)-48px)] pr-2 overflow-y-auto w-96 space-y-6 sticky top-[calc(var(--header-top-height)+var(--header-bottom-height))]">
      {/* Filter header */}
      <div className="flex justify-between items-center">
        <Typography variant="h3">Bộ lọc ({filteredPropertysCount})</Typography>
        <Button size="sm" variant="outline" onClick={() => navigate({ search: (prev) => pick(prev, ['item_type']) })}>
          <XIcon />
          Xóa lọc
        </Button>
      </div>

      {/* Filter input group */}
      <DebouncedSearchInput />

      {/* Filter list */}

      <Accordion multiple className="w-full" defaultValue={['item_type', 'category_slug', 'rental_price_per_day']}>
        {/* Product type */}
        <AccordionItem value="item_type">
          <AccordionTrigger className="xl:text-base font-semibold">Loại sản phẩm</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              defaultValue={search.item_type}
              onValueChange={(value) => navigate({ search: (prev) => ({ ...prev, item_type: value }) })}
            >
              <Field orientation="horizontal">
                <RadioGroupItem value={ItemType.COSTUME} id={ItemType.COSTUME} />
                <FieldLabel htmlFor={ItemType.COSTUME} className="font-normal">
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
        <AccordionItem value="category_slug" className="border-none">
          <AccordionTrigger className="xl:text-base font-semibold">Danh mục</AccordionTrigger>
          <AccordionContent>
            <FieldGroup>
              <RadioGroup
                defaultValue={search['category_slug:eq']}
                value={search['category_slug:eq'] ?? null}
                onValueChange={(value) =>
                  navigate({
                    search: (prev) => {
                      if (!value) return omit(prev, ['category_slug:eq'])
                      return { ...prev, 'category_slug:eq': value }
                    },
                  })
                }
              >
                <Field orientation="horizontal">
                  <RadioGroupItem value={null} id={'all-categories'} />
                  <FieldLabel htmlFor={'all-categories'} className="text-sm">
                    Tất cả danh mục
                  </FieldLabel>
                </Field>
                {Array.isArray(categories) &&
                  categories.map((cate) => (
                    <Field orientation={'horizontal'}>
                      <RadioGroupItem id={cate.slug} value={cate.slug} />
                      <FieldLabel htmlFor={cate.slug} className="text-sm">
                        {cate.name}
                      </FieldLabel>
                    </Field>
                  ))}
              </RadioGroup>
            </FieldGroup>
          </AccordionContent>
        </AccordionItem>
        {/* Gender */}
        <Activity mode={search.item_type === ItemType.COSTUME ? 'visible' : 'hidden'}>
          <AccordionItem value="gender" className="border-none">
            <AccordionTrigger className="xl:text-base font-semibold">Giới tính</AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                value={search['gender:eq']!}
                onValueChange={(value) =>
                  navigate({
                    search: (prev) => {
                      const priceRange = value ? JSON.parse(value) : null
                      if (!priceRange) return omit(prev, ['gender:eq'])
                      return {
                        ...prev,
                        'gender:eq': value,
                      }
                    },
                  })
                }
              >
                {COSTUME_GENDER_OPTIONS.map((gender) => (
                  <Field orientation="horizontal" key={gender.value}>
                    <RadioGroupItem value={gender.value} id={gender.value} />
                    <FieldLabel htmlFor={gender.value} className="text-sm">
                      {gender.label}
                    </FieldLabel>
                  </Field>
                ))}
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
        </Activity>
        {/* Pricing */}
        <AccordionItem value="rental_price_per_day" className="border-none">
          <AccordionTrigger className="xl:text-base font-semibold">Giá thuê (VND/ngày)</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={
                search['rental_price_per_day:gte']
                  ? JSON.stringify({ min: search['rental_price_per_day:gte'], max: search['rental_price_per_day:lte'] })
                  : null
              }
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
        {/* Color */}
        <Activity mode={search.item_type === ItemType.COSTUME ? 'visible' : 'hidden'}>
          <AccordionItem value="color:eq" className="border-none">
            <AccordionTrigger className="text-lg">Màu sắc</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-10 gap-2! max-w-fit">
                {COLOR_PALETTE.map((color) => (
                  <button
                    key={color.hex}
                    style={{
                      border: 'none',
                      backgroundColor: color.hex,
                      width: 20,
                      height: 20,
                      aspectRatio: '1 / 1',
                      borderRadius: 2,
                      ...(search['color:eq'] === color.hex && {
                        outlineColor: color.hex,
                        outlineOffset: 2,
                        outlineWidth: 1,
                        outlineStyle: 'solid',
                      }),
                    }}
                    onClick={() => navigate({ search: (prev) => ({ ...prev, 'color:eq': color.hex }) })}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Activity>
        {/* Size */}
        <Activity mode={search.item_type === ItemType.COSTUME ? 'visible' : 'hidden'}>
          <AccordionItem value="size:eq">
            <AccordionTrigger className="text-lg">Size</AccordionTrigger>
            <AccordionContent>
              <div className="flex gap-2 flex-wrap">
                {SIZE_RUN.map((size) => {
                  const isActive =
                    typeof search['size:in'] === 'string' && search['size:in'].split(',').includes(size.value)

                  return (
                    <Button
                      key={size.value}
                      size="sm"
                      variant={isActive ? 'default' : 'outline'}
                      onClick={() => {
                        navigate({
                          search: (prev) => {
                            const _search = {
                              ...prev,
                              'size:in': isActive
                                ? search['size:in']
                                    ?.split(',')
                                    .filter((s) => s !== size.value)
                                    .join(',')
                                : [
                                    ...(typeof search['size:in'] === 'string' ? search['size:in'].split(',') : []),
                                    size.value,
                                  ].join(','),
                            }

                            if (_search['size:in'] === '') {
                              return omit(_search, ['size:in'])
                            }
                            return _search
                          },
                        })
                      }}
                    >
                      {size.label}
                    </Button>
                  )
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Activity>
      </Accordion>
    </div>
  )
}

const DebouncedSearchInput: React.FC = () => {
  const search = useSearch({ from: '/_public-layout/products', select: (search) => search.q, structuralSharing: false })

  const navigate = useNavigate({ from: '/products' })

  const [inputValue, setInputValue] = useState<string>(search ?? '')

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate({
        search: (prev) => {
          if (!inputValue) return omit(prev, ['q'])
          return { ...prev, q: inputValue }
        },
      })
    }, 500)

    return () => clearTimeout(timeout)
  }, [inputValue])

  return (
    <InputGroup>
      <InputGroupAddon>
        <SearchIcon className="size-4" />
      </InputGroupAddon>
      <InputGroupInput
        placeholder="Tìm theo tên"
        type="search"
        value={inputValue}
        onChange={(e) => setInputValue(e.currentTarget.value)}
      />
    </InputGroup>
  )
}

export default ProductFilterList
