import { GET_COSTUME_CATEGORY_QUERY_KEY, useGetCategoriesQuery } from '@/apis/category/hooks/use-category-request'
import type { ICategory } from '@/apis/category/types'
import { COSTUME_UNIT, CostumeGender, CostumeUnit, SIZE_RUN } from '@/apis/costume/constants'
import type { TCreateCostumeSchema, TCreateCostumeValues } from '@/apis/costume/schemas/create-costume.schema'
import type { TUpdateCostumeSchema, TUpdateCostumeValues } from '@/apis/costume/schemas/update-costume.schema'
import type { ICostume } from '@/apis/costume/types'
import { COLOR_PALETTE } from '@/common/constants/const'
import { CommonActions } from '@/common/constants/enums'
import { formatCurrency } from '@/common/helpers/format-intl'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { usePageEventContext } from '@/contexts/event-context'
import { useForm } from '@tanstack/react-form'
import React, { useRef, useState } from 'react'
import CostumeColorPlate from './costume-color-plate'

const DEFAULT_FORM_VALUES: Partial<TCreateCostumeValues> = {
  name: '',
  category_id: undefined,
  color: COLOR_PALETTE[0],
  sizes: undefined,
  description: undefined,
  gender: CostumeGender.FEMALE,
  rental_price_per_day: 0,
  unit: CostumeUnit.SET,
  images: undefined,
  hashtags: undefined,
}

type TDialogAction = CommonActions.CREATE | CommonActions.UPDATE | 'none'

const CostumeFormDialog: React.FC = () => {
  const { event$ } = usePageEventContext()
  const [open, setOpen] = useState<boolean>(false)
  const [action, setAction] = useState<TDialogAction>('none')
  const { data: categories, isLoading } = useGetCategoriesQuery(GET_COSTUME_CATEGORY_QUERY_KEY)
  const formSchemaRef = useRef<TCreateCostumeSchema | TUpdateCostumeSchema | undefined>(undefined)
  const form = useForm({
    defaultValues: DEFAULT_FORM_VALUES,
    onSubmit: ({ value }) => {
      console.log(value)
    },
    validators: { onSubmit: formSchemaRef.current },
  })

  console.log('categories', categories)

  event$.useSubscription(
    (e: { action: CommonActions.CREATE; payload: never } | { action: CommonActions.UPDATE; payload: ICostume }) => {
      if (e.action !== CommonActions.CREATE && e.action !== CommonActions.UPDATE) {
        form.reset()
        setAction('none')
        setOpen(false)
        return
      }

      setOpen(true)

      if (e.action === CommonActions.CREATE) {
        setAction(CommonActions.CREATE)
        form.reset()
      } else {
        setAction(CommonActions.UPDATE)
        form.reset(e.payload as unknown as TUpdateCostumeValues)
      }
    }
  )

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    form.handleSubmit()
  }

  const FormField = form.Field

  return (
    <Dialog open={open && action !== 'none'} onOpenChange={setOpen}>
      <DialogContent className="max-w-7xl">
        <form onSubmit={handleSubmit}>
          <FieldSet>
            <FieldLegend>Thông tin trang phục</FieldLegend>
            <FieldDescription>
              {action === CommonActions.CREATE
                ? 'Điền thông tin để tạo mới trang phục'
                : 'Cập nhật thông tin trang phục'}
            </FieldDescription>
            <FieldGroup className="grid grid-cols-12">
              <FormField name="name">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field className="col-span-5">
                      <FieldLabel htmlFor={field.name}>Tên trang phục</FieldLabel>
                      <Input
                        name={field.name}
                        id={field.name}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.currentTarget.value)}
                        placeholder='Ví dụ: "Áo dài truyền thống"'
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </FormField>
              <FormField name="category_id">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field className="col-span-5">
                      <FieldLabel htmlFor={field.name}>Bộ sưu tập</FieldLabel>
                      <Select
                        items={categories as any[]}
                        itemToStringLabel={(item: ICategory) => item.name}
                        itemToStringValue={(item: ICategory) => item.id.toString()}
                        value={field.state.value as any}
                        onValueChange={field.handleChange as any}
                      >
                        <SelectTrigger disabled={isLoading} className="w-full" id={field.name} aria-invalid={isInvalid}>
                          <SelectValue placeholder="Chọn bộ sưu tập" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.isArray(categories) &&
                            categories.map((cate) => (
                              <SelectItem key={cate.id} value={cate}>
                                {cate.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </FormField>
              <FormField name="color">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field className="col-span-2">
                      <FieldLabel htmlFor={field.name}>Màu sắc chủ đạo</FieldLabel>
                      <CostumeColorPlate value={field.state.value as any} onValueChange={field.handleChange} />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </FormField>
              <FormField name="sizes">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field className="col-span-4">
                      <FieldLabel htmlFor={field.name}>Size</FieldLabel>
                      <Select
                        multiple
                        items={SIZE_RUN}
                        value={field.state.value?.sort((a, b) => a.sortOrder - b.sortOrder)}
                        onValueChange={(value) => field.handleChange(value as unknown as TCreateCostumeValues['sizes'])}
                      >
                        <SelectTrigger disabled={isLoading} className="w-full" id={field.name} aria-invalid={isInvalid}>
                          <SelectValue placeholder="Chọn size" />
                        </SelectTrigger>
                        <SelectContent>
                          {SIZE_RUN.map((size) => (
                            <SelectItem key={size.value} value={size}>
                              {size.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </FormField>
              <FormField name="rental_price_per_day">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field className="col-span-4">
                      <FieldLabel htmlFor={field.name}>Giá thuê theo ngày (VNĐ)</FieldLabel>
                      <Input
                        name={field.name}
                        id={field.name}
                        onBlur={field.handleBlur}
                        type="number"
                        onChange={(e) => field.handleChange(+e.target.value)}
                        placeholder={formatCurrency(100_000)}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </FormField>
              <FormField name="unit">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field className="col-span-4">
                      <FieldLabel htmlFor={field.name}>Đơn vị</FieldLabel>
                      <Select items={COSTUME_UNIT} value={field.state.value} onValueChange={field.handleChange as any}>
                        <SelectTrigger disabled={isLoading} className="w-full" id={field.name} aria-invalid={isInvalid}>
                          <SelectValue placeholder="Chọn size" />
                        </SelectTrigger>
                        <SelectContent>
                          {COSTUME_UNIT.map((size) => (
                            <SelectItem key={size.value} value={size}>
                              {size.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </FormField>
              <FormField name="description">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <Field className="col-span-12">
                      <FieldLabel>Mô tả</FieldLabel>
                      <Textarea
                        placeholder="Mô tả"
                        className="field-sizing-fixed"
                        value={field.state.value}
                        onChange={field.handleChange as any}
                        onBlur={field.handleBlur}
                        aria-invalid={isInvalid}
                        rows={5}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      {/* <Editor onUpdate={({ value }) => field.handleChange(value)} defaultValue={field.state.value} /> */}
                    </Field>
                  )
                }}
              </FormField>
            </FieldGroup>
            <FieldGroup>
              <Field orientation={'horizontal'}>
                <Button>Xác nhận</Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CostumeFormDialog
