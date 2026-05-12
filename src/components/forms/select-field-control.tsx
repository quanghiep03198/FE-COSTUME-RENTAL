import { cn } from '@/lib/utils'
import type { AnyFieldApi } from '@tanstack/react-form'
import React from 'react'
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

type InputFieldControlProps<T = string> = Pick<React.ComponentProps<typeof Field>, 'orientation'> &
  Omit<React.ComponentProps<typeof Select>, 'items'> & {
    items: Array<{ value: T; label: string }>
    field: AnyFieldApi
    label?: string
    classNames?: Partial<{
      field: string
      input: string
    }>
    description?: string
    placeholder?: React.InputHTMLAttributes<HTMLInputElement>['placeholder']
    renderValue?: React.ComponentProps<typeof SelectValue>['render']
  }

function SelectFieldControl<T>({
  items,
  field,
  label,
  description,
  orientation,
  placeholder,
  classNames,
  renderValue,
}: InputFieldControlProps<T>) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field className={cn(classNames?.field)} orientation={orientation}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <Select items={items} value={field.state.value} onValueChange={field.handleChange}>
        <SelectTrigger>
          <SelectValue render={renderValue} placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={String(item.value)} value={item}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

export default SelectFieldControl
