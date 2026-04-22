import type { IEmployee } from '@/apis/employee/types'
import { ROLE_OPTIONS } from '@/apis/user/constants'
import { useCreateOrUpdateUserMutataion } from '@/apis/user/hooks/use-user-request'
import {
  createUserSchema,
  type TCreateUserSchema,
  type TCreateUserValues,
} from '@/apis/user/schemas/create-user.schema'
import {
  updateUserSchema,
  type TUpdateUserSchema,
  type TUpdateUserValues,
} from '@/apis/user/schemas/update-user.schema'
import { CommonActions } from '@/common/constants/enums'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
} from '@/components/ui/combobox'
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
import { Input } from '@/components/ui/input'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePageEventContext } from '@/contexts/event-context'
import generateAvatar from '@/lib/generate-avatar'

import { useForm } from '@tanstack/react-form'
import React, { useRef, useState } from 'react'

const DEFAULT_FORM_VALUES = Object.freeze({
  username: '',
  role: '',
  employee_id: null,
})

const UserFormDialog: React.FC = () => {
  const { event$ } = usePageEventContext()
  const [action, setAction] = useState<
    CommonActions.CREATE | CommonActions.UPDATE | null
  >(null)
  const [open, setOpen] = useState<boolean>(!!action)
  const formSchemaRef = useRef<
    TCreateUserSchema | TUpdateUserSchema | undefined
  >(undefined)
  // const { data: employees } = useQuery(
  // 	getEmployeeQueryOptions({
  // 		'position:in': `${Position.MANAGER},${Position.WAREHOUSE_MANAGER},${Position.ORDER_PROCESSOR}`,
  // 		'user_id:eq': null
  // 	})
  // )

  const employees = []
  const mutation = useCreateOrUpdateUserMutataion(action)

  const form = useForm({
    defaultValues: DEFAULT_FORM_VALUES,
    onSubmit: async ({ value }) => {
      if (typeof mutation?.mutateAsync !== 'function') return

      if (action === CommonActions.CREATE) {
        const createValue = value as unknown as TCreateUserValues
        await mutation.mutateAsync({
          ...createValue,
          employee_id: createValue.employee_id?.id,
          password: createValue.password ?? createValue.username,
        })
      } else {
        await mutation.mutateAsync(value as unknown as TUpdateUserValues)
      }
      setOpen(false)
    },
    validators: { onSubmit: formSchemaRef.current } as Parameter<
      typeof useForm
    >['validators'],
  })

  event$.useSubscription((e) => {
    if (e.action !== CommonActions.CREATE && e.action !== CommonActions.UPDATE)
      return
    setAction(e.action)
    setOpen(true)
    if (e.action === CommonActions.CREATE) {
      form.reset()
      formSchemaRef.current = createUserSchema
    } else {
      formSchemaRef.current = updateUserSchema
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
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={(open) => {
        if (!open) {
          form.reset()
          setAction(null)
        }
      }}
    >
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FieldGroup>
            <FieldSet>
              <FieldLegend>Thông tin đăng nhập</FieldLegend>
              <FieldDescription>
                Người dùng sẽ sử dụng thông tin này để đăng nhập vào tài khoản.
              </FieldDescription>
              <FieldGroup>
                <FormField
                  name="employee_id"
                  listeners={{
                    onChange: ({ value }: { value: IEmployee }) => {
                      form.setFieldValue('username', value.employee_code)
                      form.setFieldValue('password', value.employee_code)
                    },
                  }}
                >
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel>Nhân viên</FieldLabel>
                        <Combobox
                          name={field.name}
                          items={employees}
                          value={field.state.value as IEmployee}
                          itemToStringLabel={(value: IEmployee) =>
                            value.full_name
                          }
                          itemToStringValue={(value: IEmployee) =>
                            String(value.id)
                          }
                          isItemEqualToValue={(itemValue, value) =>
                            itemValue.id === value.id
                          }
                          onValueChange={field.handleChange}
                          // readOnly={action === CommonActions.UPDATE}
                        >
                          <ComboboxInput
                            placeholder="Chọn nhân viên"
                            // readOnly={action === CommonActions.UPDATE}
                            showClear
                          />
                          <ComboboxContent>
                            <ComboboxGroup>
                              <ComboboxLabel>Nhân sự hiện có</ComboboxLabel>
                              <ComboboxCollection>
                                {(employee) => (
                                  <ComboboxItem
                                    key={employee.id}
                                    value={employee}
                                    render={
                                      <Item size="xs">
                                        <ItemMedia>
                                          <Avatar>
                                            <AvatarImage
                                              src={generateAvatar({
                                                name: employee.full_name,
                                              })}
                                            />
                                            <AvatarFallback>
                                              {employee.full_name
                                                .slice(0, 2)
                                                .toUpperCase()}
                                            </AvatarFallback>
                                          </Avatar>
                                        </ItemMedia>
                                        <ItemContent>
                                          <ItemTitle className="capitalize">
                                            {employee.full_name}
                                          </ItemTitle>
                                          <ItemDescription>
                                            {employee.phone}
                                          </ItemDescription>
                                        </ItemContent>
                                      </Item>
                                    }
                                  />
                                )}
                              </ComboboxCollection>
                            </ComboboxGroup>
                          </ComboboxContent>
                        </Combobox>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                </FormField>
                <FormField name="username">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field>
                        <FieldLabel>Tài khoản</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value as string}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          readOnly
                          placeholder="Tên đăng nhập"
                        />
                        <FieldDescription>
                          Tên đăng nhập mặc định sẽ là mã nhân viên
                        </FieldDescription>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                </FormField>
                <FormField name="password">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field>
                        <FieldLabel>Mật khẩu</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value as string}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="******"
                          type="password"
                        />
                        <FieldDescription>
                          Mật khẩu đăng nhập mặc định sẽ là mã nhân viên. Bạn có
                          thể đặt 1 mật khẩu tạm thời khác để người dùng dễ nhớ
                          hơn, sau đó yêu cầu họ thay đổi đổi.
                        </FieldDescription>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                </FormField>
                <FormField
                  name="role"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid} className="col-span-2">
                        <FieldLabel>Vai trò</FieldLabel>
                        <Select
                          name={field.name}
                          items={ROLE_OPTIONS}
                          value={field.state.value}
                          onValueChange={({
                            value,
                          }: Record<'label' | 'value', string>) =>
                            field.handleChange(value)
                          }
                        >
                          <SelectTrigger aria-invalid={isInvalid}>
                            <SelectValue placeholder="Chọn vai trò" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Vai trò</SelectLabel>
                              {ROLE_OPTIONS.length > 0 ? (
                                ROLE_OPTIONS.map((role) => (
                                  <SelectItem key={role.value} value={role}>
                                    {role.label}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem disabled>
                                  Không có dữ liệu
                                </SelectItem>
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />
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

export default UserFormDialog
