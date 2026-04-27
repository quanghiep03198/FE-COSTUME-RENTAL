import { GET_COSTUME_CATEGORY_QUERY_KEY, useGetCategoriesQuery } from '@/apis/category/hooks/use-category-request'
import type { ICategory } from '@/apis/category/types'
import { COSTUME_UNIT, CostumeGender, SIZE_RUN } from '@/apis/costume/constants'
import { useCreateOrUpdateCostumeMutation } from '@/apis/costume/hooks/use-costume-request'
import {
  createCostumeSchema,
  type TCreateCostumeSchema,
  type TCreateCostumeValues,
} from '@/apis/costume/schemas/create-costume.schema'
import { updateCostumeSchema, type TUpdateCostumeSchema } from '@/apis/costume/schemas/update-costume.schema'
import type { ICostume } from '@/apis/costume/types'
import type { IImage } from '@/apis/image/types'
import { DEFAULT_COSTUME_DESCRIPTION } from '@/assets/data/costume-description'
import { COLOR_PALETTE } from '@/common/constants/const'
import { CommonActions, ItemType } from '@/common/constants/enums'
import { formatCurrency } from '@/common/helpers/format-intl'
import { getImageUrl } from '@/common/helpers/get-image-url'
import Image from '@/components/shared/image'
import { TagsInput } from '@/components/shared/tags-input'
import { Editor } from '@/components/shared/text-editor'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePageEventContext } from '@/contexts/event-context'
import { useForm, useStore } from '@tanstack/react-form'
import { sortBy } from 'lodash-es'
import { ImageIcon, ImagePlusIcon, XIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import ImagesGallary from '../images-gallery/images-gallery'
import CostumeColorPlate from './costume-color-plate'

const DEFAULT_FORM_VALUES = {
  name: '',
  category_id: undefined,
  color: COLOR_PALETTE[0],
  sizes: undefined,
  description: undefined,
  gender: CostumeGender.FEMALE,
  rental_price_per_day: 0,
  unit: undefined,
  images: [],
  hashtags: [],
}

type TDialogAction = CommonActions.CREATE | CommonActions.UPDATE | 'none'

const CostumeFormDialog: React.FC = () => {
  const { event$ } = usePageEventContext()
  const [open, setOpen] = useState<boolean>(false)
  const [action, setAction] = useState<TDialogAction>('none')
  const { data: categories, isLoading } = useGetCategoriesQuery(GET_COSTUME_CATEGORY_QUERY_KEY)
  const mutation = useCreateOrUpdateCostumeMutation(action)
  const formSchemaRef = useRef<TCreateCostumeSchema | TUpdateCostumeSchema | undefined>(undefined)
  const editorRef = useRef<{
    getHTML: () => string
    isEmpty: () => boolean
  }>(null)

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
        formSchemaRef.current = createCostumeSchema
        form.reset()
      } else {
        setAction(CommonActions.UPDATE)
        formSchemaRef.current = updateCostumeSchema
        form.reset(e.payload as any)
      }
    }
  )

  const form = useForm({
    defaultValues: DEFAULT_FORM_VALUES as unknown as TCreateCostumeValues,
    onSubmitInvalid: ({ value, formApi }) => {
      console.warn(formApi.state.errors)
      console.log({ ...value, description: editorRef.current?.getHTML() })
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync({
        ...value,
        description: editorRef.current?.getHTML(),
        category_id: value.category_id.id,
        sizes: value.sizes.sort((a, b) => a.sortOrder - b.sortOrder).map((item) => item.value),
        unit: value.unit.value,
        images: value.images?.map((img) => img.id),
      })
      setAction('none')
      setOpen(false)
    },
    validators: { onSubmit: formSchemaRef.current as any },
  })

  const selectedImages = useStore(form.store, (state) => state.values.images)

  useEffect(() => {
    form.setFieldValue('description', editorRef.current?.getHTML() ?? '')
  }, [editorRef.current?.getHTML()])

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    form.handleSubmit()
  }

  const FormField = form.Field

  return (
    <>
      {/* Form Dialog */}
      <Dialog open={open && action !== 'none'} onOpenChange={setOpen}>
        <DialogContent className="sm:max-md:rounded-none sm:max-md:h-screen overflow-auto max-w-6xl">
          <form onSubmit={handleSubmit}>
            <FieldSet>
              <FieldLegend>Thông tin trang phục</FieldLegend>
              <FieldDescription>
                {action === CommonActions.CREATE
                  ? 'Điền thông tin để tạo mới trang phục'
                  : 'Cập nhật thông tin trang phục'}
              </FieldDescription>
              <FieldGroup className="max-h-[75vh] overflow-auto">
                <FormField name="name">
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Tên trang phục</FieldLabel>
                        <Input
                          name={field.name}
                          id={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.currentTarget.value)}
                          placeholder='Ví dụ: "Áo dài truyền thống"'
                          className="w-auto"
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
                      <Field>
                        <FieldLabel htmlFor={field.name}>Bộ sưu tập</FieldLabel>
                        <Select
                          items={categories as any[]}
                          itemToStringLabel={(item: ICategory) => item.name}
                          itemToStringValue={(item: ICategory) => item.id.toString()}
                          value={field.state.value as any}
                          onValueChange={field.handleChange as any}
                        >
                          <SelectTrigger
                            disabled={isLoading}
                            className="w-full"
                            id={field.name}
                            aria-invalid={isInvalid}
                          >
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
                <FormField name="hashtags">
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field className="col-span-4">
                        <FieldLabel htmlFor={field.name}>Hashtags</FieldLabel>
                        <TagsInput
                          value={field.state.value as any}
                          onValueChange={field.handleChange as any}
                          onBlur={field.handleBlur}
                          placeholder="#aoDaiVietNam"
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                </FormField>
                <FormField name="gender">
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <FieldGroup className="col-span-12">
                        <FieldLabel>Giới tính</FieldLabel>
                        <RadioGroup defaultValue="comfortable" className="w-fit">
                          <Field orientation="horizontal">
                            <RadioGroupItem value={CostumeGender.MALE} id={CostumeGender.MALE} />
                            <FieldContent>
                              <FieldLabel htmlFor="desc-r1">Nam</FieldLabel>
                              <FieldDescription>Trang phục danh riêng cho Nam</FieldDescription>
                            </FieldContent>
                          </Field>
                          <Field orientation="horizontal">
                            <RadioGroupItem value={CostumeGender.FEMALE} id={CostumeGender.MALE} />
                            <FieldContent>
                              <FieldLabel htmlFor="desc-r2">Nữ</FieldLabel>
                              <FieldDescription>Trang phục dành riêng cho Nữ</FieldDescription>
                            </FieldContent>
                          </Field>
                          <Field orientation="horizontal">
                            <RadioGroupItem value={CostumeGender.UNISEX} id={CostumeGender.UNISEX} />
                            <FieldContent>
                              <FieldLabel htmlFor="desc-r2">Unisex</FieldLabel>
                              <FieldDescription>Trang phục dành cho cả Nam & Nữ</FieldDescription>
                            </FieldContent>
                          </Field>
                        </RadioGroup>
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </FieldGroup>
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
                          value={sortBy(field.state.value, ['sortOrder']) as any}
                          onValueChange={(value) => field.handleChange(value as any)}
                        >
                          <SelectTrigger
                            disabled={isLoading}
                            className="w-full"
                            id={field.name}
                            aria-invalid={isInvalid}
                          >
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
                      <Field className="col-span-3">
                        <FieldLabel htmlFor={field.name}>Giá thuê theo ngày (VNĐ)</FieldLabel>
                        <Input
                          name={field.name}
                          id={field.name}
                          onBlur={field.handleBlur}
                          type="number"
                          value={field.state.value}
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
                      <Field className="col-span-3">
                        <FieldLabel htmlFor={field.name}>Đơn vị</FieldLabel>
                        <Select
                          items={COSTUME_UNIT}
                          value={field.state.value}
                          onValueChange={field.handleChange as any}
                        >
                          <SelectTrigger
                            disabled={isLoading}
                            className="w-full"
                            id={field.name}
                            aria-invalid={isInvalid}
                          >
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
                <FormField name="images">
                  {(field) => {
                    return (
                      <Field className="col-span-12">
                        <FieldLabel htmlFor={field.name}>Hình ảnh</FieldLabel>
                        {!Array.isArray(field.state.value) || !field.state.value.length ? (
                          <Empty className="border">
                            <EmptyMedia variant="icon">
                              <ImageIcon />
                            </EmptyMedia>
                            <EmptyHeader>
                              <EmptyTitle>Chưa có hình ảnh nào được chọn</EmptyTitle>
                              <EmptyDescription>Hãy chọn ít nhất 1 hình ảnh cho trang phục</EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent>
                              <label className={buttonVariants({ size: 'sm' })} htmlFor="image-gallery-dialog-trigger">
                                <ImagePlusIcon />
                                Thêm hình ảnh
                              </label>
                            </EmptyContent>
                          </Empty>
                        ) : (
                          <div className="grid grid-cols-2 md:max-xl:grid-cols-4 xxl:grid-cols-6 gap-4">
                            {field.state.value.map((image) => (
                              <div className="relative">
                                <Button
                                  variant="secondary"
                                  size="icon-xs"
                                  className="absolute top-2 right-2"
                                  onClick={() => {
                                    const afterDelete = field.state.value!.filter(
                                      (img) => img.id !== image.id
                                    ) as unknown as TCreateCostumeValues['images']
                                    field.handleChange(afterDelete)
                                  }}
                                >
                                  <XIcon />
                                </Button>
                                <Image
                                  key={image.id}
                                  src={getImageUrl(image.dest)}
                                  alt={image.file_name}
                                  className="w-full aspect-square object-cover rounded-lg"
                                />
                              </div>
                            ))}

                            <label
                              className="w-full aspect-square flex flex-col text-sm justify-center items-center gap-2 rounded-lg bg-accent text-accent-foreground"
                              role="button"
                              htmlFor="image-gallery-dialog-trigger"
                            >
                              <ImagePlusIcon />
                              Thêm hình ảnh
                            </label>
                          </div>
                        )}
                      </Field>
                    )
                  }}
                </FormField>
                <Field className="col-span-12">
                  <FieldLabel>Mô tả</FieldLabel>
                  <Editor ref={editorRef} defaultValue={DEFAULT_COSTUME_DESCRIPTION} />
                  {!editorRef.current?.isEmpty() === false && (
                    <FieldError errors={form.getFieldMeta('description')?.errors} />
                  )}
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field orientation={'horizontal'} className="justify-end">
                  <DialogClose
                    render={
                      <Button type="button" variant="secondary">
                        Đóng
                      </Button>
                    }
                  />
                  <Button type="submit">Xác nhận</Button>
                </Field>
              </FieldGroup>
            </FieldSet>
          </form>
        </DialogContent>
      </Dialog>
      {/* Images Gallery Dialog */}
      <Dialog>
        <DialogTrigger id="image-gallery-dialog-trigger" />
        <DialogContent className="max-w-7xl h-">
          <DialogHeader>
            <DialogTitle>Danh mục hình ảnh</DialogTitle>
            <DialogDescription>
              Hãy chọn các hình ảnh liên quan áp dụng cho trang phục hoặc tải lên nếu muốn
            </DialogDescription>
          </DialogHeader>
          <div className="">
            <ImagesGallary
              type={ItemType.COSTUMES}
              onSelect={(images) => {
                console.table(images)
                form.setFieldValue('images', images as any)
              }}
              selected={(selectedImages ?? []) as unknown as IImage[]}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CostumeFormDialog
