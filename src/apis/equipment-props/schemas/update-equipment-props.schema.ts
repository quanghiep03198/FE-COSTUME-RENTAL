import z from 'zod'
import type { IEquipmentProps } from '../types'
import { createEquipmentPropsSchema } from './create-equipment-props.schema'

export const updateEquipmentPropsSchema = createEquipmentPropsSchema.partial()

export type TUpdateEquipmentPropsSchema = typeof updateEquipmentPropsSchema

export type TUpdateEquipmentPropsValues = z.infer<TUpdateEquipmentPropsSchema> & Pick<IEquipmentProps, 'id'>
