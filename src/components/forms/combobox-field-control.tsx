import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
} from '@/components/ui/combobox'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import type { AnyFieldApi } from '@tanstack/react-form'
import React from 'react'

type ComboboxFieldControlProps<T = string> = Omit<React.ComponentProps<typeof Combobox>, 'items'> & {
  field: AnyFieldApi
  placeholder?: string
  description?: string
  label?: string
  comboboxLabel?: string
  items: T[]
  renderItem: (item: T) => React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
}

export function ComboboxFieldControl<T>({
  field,
  items,
  renderItem,
  comboboxLabel,
  label,
  placeholder,
}: ComboboxFieldControlProps<T>) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <Combobox
        name={field.name}
        items={items}
        value={field.state.value}
        onValueChange={(value: any) => field.handleChange(value)}
      >
        <ComboboxInput placeholder={placeholder ?? 'Nhập để tìm kiếm'} showClear />
        <ComboboxContent>
          <ComboboxGroup>
            {comboboxLabel && <ComboboxLabel>{comboboxLabel}</ComboboxLabel>}
            <ComboboxCollection>
              {(item) => <ComboboxItem key={item.value} value={item} render={() => renderItem(item)} />}
            </ComboboxCollection>
          </ComboboxGroup>
        </ComboboxContent>
      </Combobox>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
