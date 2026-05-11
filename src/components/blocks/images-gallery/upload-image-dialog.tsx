import { useGetCategoriesQuery } from '@/apis/category/hooks/use-category-request'
import { useUploadImagesMutation } from '@/apis/image/hooks/use-image-request'
import { uploadImagesSchema, type TUploadImagesValues } from '@/apis/image/schemas/upload-images.schema'
import ImageFieldControl from '@/components/forms/image-field-control'
import SelectFieldControl from '@/components/forms/select-field-control'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog'
import { Field, FieldDescription, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { useForm } from '@tanstack/react-form'
import React, { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { usePubSubSubscription } from '.'

const UploadImageDialog: React.FC = () => {
  const [open, setOpen] = useState(false)
  const { data: categories } = useGetCategoriesQuery()
  const { mutateAsync: uploadAsync, isPending } = useUploadImagesMutation()

  const handleUpload = async (data: TUploadImagesValues) => {
    try {
      await uploadAsync(data)
      toast.success('Tải lên hình ảnh thành công', { id: 'upload-images' })
    } catch (e) {
      console.error('Error uploading images:', e)
      toast.error('Lỗi tải lên hình ảnh', { id: 'upload-images' })
    }
  }

  const form = useForm({
    defaultValues: {
      files: [] as File[],
      category: null,
    } as unknown as TUploadImagesValues,
    validators: {
      onSubmit: uploadImagesSchema as any,
    },
    onSubmit: ({ value }) => handleUpload(value),
  })

  usePubSubSubscription('image:create', () => {
    setOpen(true)
  })

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    form.handleSubmit()
  }

  const categoryOptions = useMemo(() => {
    if (!Array.isArray(categories)) return []
    return categories.map((category) => ({
      label: category.name,
      value: category.id,
    }))
  }, [categories])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl ">
        <form onSubmit={handleSubmit}>
          <FieldSet>
            <FieldLegend>Tải lên hình ảnh</FieldLegend>
            <FieldDescription>Chọn hình ảnh để tải lên cho danh mục</FieldDescription>
            <FieldGroup>
              <form.Field name="category">
                {(field) => <SelectFieldControl field={field} items={categoryOptions} placeholder="Chọn danh mục" />}
              </form.Field>
              <form.Field name="files">
                {(field) => {
                  return <ImageFieldControl field={field} multiple={true} orientation={undefined} />
                }}
              </form.Field>
            </FieldGroup>
            <Field orientation="horizontal" className="justify-end">
              <DialogClose onClick={() => form.reset()} render={<Button variant="secondary">Hủy</Button>} />
              <Button type="submit" disabled={isPending}>
                {isPending && <Spinner />} Tải lên
              </Button>
            </Field>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UploadImageDialog
