import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from '@/components/ui/combobox'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import type { ComboboxRootProps } from '@base-ui/react'
import type { Group } from '@base-ui/react/internals/resolveValueLabel'
import type { AnyFieldApi } from '@tanstack/react-form'
import React from 'react'

type ComboboxFieldControlProps<T = Record<string, unknown>> = {
  field: AnyFieldApi
  placeholder?: string
  description?: string
  label?: string
  labelField: keyof T
  valueField: keyof T
  items: ComboboxRootProps<T>['items']
  renderItem?: (item: T) => React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
}

export function ComboboxFieldControl<T>({
  field,
  items,
  label,
  description,
  labelField,
  valueField,
  placeholder,
  renderItem,
}: ComboboxFieldControlProps<T>) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <Combobox
        name={field.name}
        items={items}
        value={field.state.value}
        onValueChange={(value: T) => field.handleChange(value)}
        itemToStringLabel={(item) => item[labelField]}
        itemToStringValue={(item) => item[valueField]}
        isItemEqualToValue={(itemValue, value) => itemValue[valueField] === value[valueField]}
      >
        <ComboboxInput placeholder={placeholder ?? 'Nhập để tìm kiếm'} showClear />
        <ComboboxContent>
          <ComboboxEmpty>Không có kết quả phù hợp</ComboboxEmpty>
          <ComboboxList>
            {(option, index) => {
              if (Array.isArray((option as Group<T>).items))
                return (
                  <ComboboxGroup key={`${field.name}-group-${index}`} items={option.items}>
                    {option.label && <ComboboxLabel>{option.label}</ComboboxLabel>}
                    <ComboboxCollection>
                      {(opt) => (
                        <ComboboxItem
                          value={opt}
                          {...(typeof renderItem === 'function'
                            ? { render: renderItem(opt) }
                            : { children: opt[labelField] as React.ReactNode })}
                        />
                      )}
                    </ComboboxCollection>
                  </ComboboxGroup>
                )
              else
                return (
                  <ComboboxItem
                    key={`${field.name}-item-${index}`}
                    value={option}
                    {...(typeof renderItem === 'function'
                      ? { render: renderItem(option) }
                      : { children: option[labelField] as React.ReactNode })}
                  />
                )
            }}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
