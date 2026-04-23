import { Position, POSITION_OPTIONS } from '@/apis/employee/constants'
import { useCreateOrUpdateEmployeeMutataion } from '@/apis/employee/hooks/use-employee-request'
import { createEmployeeSchema, type TCreateEmployeeSchema } from '@/apis/employee/schemas/create-employee.schema'
import {
  updateEmployeeSchema,
  type TUpdateEmployeeSchema,
  type TUpdateEmployeeValues,
} from '@/apis/employee/schemas/update-employee.schema'
import { CommonActions } from '@/common/constants/enums'
import { standardizeName } from '@/common/helpers/standardize-name'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Icon } from '@/components/ui/icon'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePageEventContext } from '@/contexts/event-context'
import { useForm } from '@tanstack/react-form'
import { omit } from 'lodash-es'
import React, { useRef, useState } from 'react'

const DEFAULT_FORM_VALUES: TUpdateEmployeeValues = {
  full_name: '',
  citizen_id_number: '',
  email: undefined,
  phone: '',
  address: '',
  position: undefined,
}

const EmployeeFormDialog: React.FC = () => {
  const { event$ } = usePageEventContext()
  const [action, setAction] = useState<CommonActions.CREATE | CommonActions.UPDATE | 'none'>('none')
  const [open, setOpen] = useState<boolean>(!!action)
  const formSchemaRef = useRef<TCreateEmployeeSchema | TUpdateEmployeeSchema>(createEmployeeSchema)

  const mutation = useCreateOrUpdateEmployeeMutataion(action)

  const form = useForm({
    defaultValues: DEFAULT_FORM_VALUES,
    onSubmit: async ({ value }) => {
      if (typeof mutation?.mutateAsync !== 'function') return
      await mutation.mutateAsync(value)
      setOpen(false)
    },
    validators: { onSubmit: formSchemaRef.current! },
  })

  event$.useSubscription((e) => {
    if (e.action !== CommonActions.CREATE && e.action !== CommonActions.UPDATE) return
    setAction(e.action)
    setOpen(true)
    if (e.action === CommonActions.CREATE) {
      form.reset()
      formSchemaRef.current = createEmployeeSchema
    } else {
      formSchemaRef.current = updateEmployeeSchema
      form.reset(e.payload, { keepDefaultValues: true })
    }
  })

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    form.handleSubmit()
  }

  const { Field: FormField } = form

  return (
    <Dialog
      open={open && action !== 'none'}
      onOpenChange={setOpen}
      onOpenChangeComplete={(open) => {
        if (!open) {
          form.reset()
          setAction('none')
        }
      }}
    >
      <DialogContent className="max-w-2xl @container">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Thông tin Nhân viên</FieldLegend>
              <FieldDescription>Hồ sơ thông tin sơ yếu lí lịch nhân viên trên hệ thống</FieldDescription>
              <FieldGroup className="grid xl:grid-cols-2">
                <FormField
                  name="full_name"
                  listeners={{
                    onChange: ({ value }: { value: string }) => {
                      form.setFieldValue('full_name', standardizeName(value))
                    },
                    onChangeDebounceMs: 300,
                  }}
                >
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field>
                        <FieldLabel>Họ tên</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value as string}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(standardizeName(e.target.value))}
                          aria-invalid={isInvalid}
                          type="text"
                          placeholder="Nguyễn Văn A"
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                </FormField>
                <FormField name="citizen_id_number">
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field>
                        <FieldLabel>Số CCCD</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value as string}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          type="text"
                          inputMode="numeric"
                          placeholder="*** *** *** ***"
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                </FormField>
                <FormField name="phone">
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field>
                        <FieldLabel>Số điện thoại</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value as string}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          type="tel"
                          placeholder="09xx xxx xxx"
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                </FormField>
                <FormField name="email">
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field>
                        <FieldLabel>Email</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value as string}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          type="email"
                          placeholder="example@gmail.com"
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                </FormField>
                <FormField name="address">
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field>
                        <FieldLabel>Địa chỉ liên hệ</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value as string}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          type="text"
                          placeholder="Số 1, đường Lạch Tray, TP.Hải Phòng"
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                </FormField>
                <FormField name="position">
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field>
                        <FieldLabel>Chức vụ</FieldLabel>
                        <Select
                          items={POSITION_OPTIONS.map((item) => omit(item, ['icon']))}
                          value={field.state.value as Position}
                          onValueChange={(value) => field.handleChange(value!)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chức vụ" />
                          </SelectTrigger>
                          <SelectContent>
                            {POSITION_OPTIONS.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                <div className="flex gap-x-2 items-center">
                                  <Icon name={item.icon} />
                                  {item.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                </FormField>
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
          <Field orientation="horizontal" className="justify-end">
            <Button type="submit">Xác nhận</Button>
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  Hủy
                </Button>
              }
            />
          </Field>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EmployeeFormDialog
