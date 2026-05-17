import {
  GET_COSTUME_CATEGORY_QUERY_KEY,
  useCreateOrUpdateCategoryMutation,
} from '@/apis/category/hooks/use-category-request'
import { createCategorySchema } from '@/apis/category/schemas/create-category.schema'
import { CommonActions, ItemType } from '@/common/constants/enums'
import { standardizeName } from '@/common/helpers/standardize-name'
import { Button } from '@/components/ui/button'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Spinner } from '@/components/ui/spinner'
import { useForm } from '@tanstack/react-form'
import { CircleFadingPlus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { getCategoryTypeName } from './utils'

const CategoryPopoverForm: React.FC<{ type: ItemType }> = ({ type }) => {
  const [open, setOpen] = useState<boolean>(false)
  const { mutateAsync, isPending } = useCreateOrUpdateCategoryMutation(
    CommonActions.CREATE,
    GET_COSTUME_CATEGORY_QUERY_KEY
  )

  const form = useForm({
    defaultValues: {
      name: '',
      type,
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await mutateAsync(value)
        toast.success('Thêm danh mục thành công')
        setOpen(false)
        formApi.reset()
      } catch (error) {
        toast.error('Đã có lỗi xảy ra! Vui lòng thử lại sau')
      }
    },
    validators: { onSubmit: createCategorySchema },
  })

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()
    form.handleSubmit()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button>
            <CircleFadingPlus /> Thêm danh mục
          </Button>
        }
      />
      <PopoverContent className="w-fit" align="end">
        <form onSubmit={handleSubmit}>
          <FieldSet>
            <FieldLegend>Tạo mới danh mục {getCategoryTypeName(type)}</FieldLegend>
            <FieldDescription>
              Nhập các thông tin vào biểu phía dưới để thêm mới 1 danh mục {getCategoryTypeName(type)}
            </FieldDescription>
            <FieldGroup>
              <form.Field
                name="name"
                listeners={{
                  onBlur: ({ value }) => {
                    form.setFieldValue('name', standardizeName(value))
                  },
                  onBlurDebounceMs: 200,
                }}
              >
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Tên danh mục</FieldLabel>
                      <Input
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.currentTarget.value)}
                        placeholder="Tên danh mục không quá 6 ký tự."
                        aria-invalid={isInvalid}
                      />
                      <FieldDescription>Tên danh mục nên ngắn gọn rõ nghĩa và dễ nhớ</FieldDescription>
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </form.Field>
              <Field orientation="horizontal" className="flex-row-reverse">
                <Button type="button" variant="secondary" disabled={isPending}>
                  Hủy
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isPending}
                  className="group/submit-btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Spinner className="hidden group-disabled/submit-btn:inline-block" />
                  Xác nhận
                </Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </PopoverContent>
    </Popover>
  )
}

export default CategoryPopoverForm
