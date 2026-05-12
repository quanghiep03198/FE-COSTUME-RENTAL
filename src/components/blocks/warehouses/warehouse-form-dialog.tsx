import { Position } from '@/apis/employee/constants'
import { useGetEmployeesQuery } from '@/apis/employee/hooks/use-employee-request'
import type { IEmployee } from '@/apis/employee/types'
import { createWarehouseSchema, type TCreateWarehouseSchema } from '@/apis/warehouse/schemas/create-warehouse.schema'
import type { TUpdateWarehouseSchema } from '@/apis/warehouse/schemas/update-warehouse.schema'
import { CommonActions, ItemType } from '@/common/constants/enums'
import { ComboboxFieldControl } from '@/components/forms/combobox-field-control'
import InputFieldControl from '@/components/forms/input-field-control'
import SelectFieldControl from '@/components/forms/select-field-control'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Field, FieldDescription, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'
import generateAvatar from '@/lib/generate-avatar'
import { useForm } from '@tanstack/react-form'
import React, { useMemo, useRef, useState } from 'react'
import { z } from 'zod'
import { usePubSubSubscription } from '.'
import { WAREHOUSE_TYPE_OPTIONS } from './constant'

const WarehouseFormDialog: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [action, setAction] = useState<CommonActions.CREATE | CommonActions.UPDATE | 'none'>('none')
  const formSchemaRef = useRef<TCreateWarehouseSchema | TUpdateWarehouseSchema | any>(z.any())
  const { data: employees } = useGetEmployeesQuery({ 'position:eq': Position.WAREHOUSE_MANAGER })

  const form = useForm({
    defaultValues: {
      name: '',
      type: { label: '', value: '' as unknown as ItemType },
      managed_by: {},
    },
    validators: {
      onSubmit: formSchemaRef.current,
    },
  })

  usePubSubSubscription('warehouse:create', () => {
    formSchemaRef.current = createWarehouseSchema
    form.reset()
    setAction(CommonActions.CREATE)
  })

  usePubSubSubscription('warehouse:update', (data) => {
    formSchemaRef.current = createWarehouseSchema
    form.reset(data, { keepDefaultValues: true })
    setAction(CommonActions.UPDATE)
  })

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    form.handleSubmit()
  }

  const employeeOptions = useMemo(() => {
    if (!Array.isArray(employees)) return []

    return employees?.map((employee) => ({
      value: employee.id,
      label: employee.full_name,
    }))
  }, [employees])

  const FieldItem = form.Field

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) setAction('none')
        setOpen(open)
      }}
    >
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <FieldSet>
            <FieldLegend>{action === CommonActions.CREATE ? 'Tạo mới kho' : 'Cập nhật kho'}</FieldLegend>
            <FieldDescription>
              {action === CommonActions.CREATE
                ? 'Điền thông tin để tạo mới kho'
                : 'Điều chỉnh thông tin và lưu để cập nhật kho'}
            </FieldDescription>
            <FieldGroup>
              <FieldItem name="name">
                {(field) => (
                  <InputFieldControl
                    field={field}
                    placeholder="Nhập tên kho"
                    description="Tên kho phải là duy nhất và không được để trống"
                  />
                )}
              </FieldItem>
              <FieldItem name="type">
                {(field) => (
                  <SelectFieldControl
                    field={field}
                    placeholder="Chọn loại kho"
                    options={WAREHOUSE_TYPE_OPTIONS}
                    description={`
                  Loại kho xác định loại trang phục hoặc đạo cụ mà kho này quản lý. Vui lòng chọn loại phù hợp với nội dung bạn sẽ lưu trữ trong kho này.
                    `}
                  />
                )}
              </FieldItem>
              <FieldItem name="managed_by">
                {(field) => (
                  <ComboboxFieldControl
                    field={field}
                    items={employees ?? []}
                    renderItem={(item: IEmployee) => (
                      <Item className="p-0" size="xs">
                        <ItemMedia>
                          <Avatar>
                            <AvatarImage src={generateAvatar({ name: item?.full_name })} />
                            <AvatarFallback>{item?.full_name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>{item.full_name}</ItemTitle>
                          <ItemDescription>{item.email}</ItemDescription>
                        </ItemContent>
                      </Item>
                    )}
                  />
                )}
              </FieldItem>
              <Field orientation={'horizontal'}>
                <Button type="submit">Lưu</Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default WarehouseFormDialog
