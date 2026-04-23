import {object, string, coerce, number, nativeEnum, type infer as Infer} from 'zod'

import { ContractType } from '../constants'

export const createContractSchema = object({
  employee_id: object({ id: number(), full_name: string() }, { message: 'Vui lòng chọn 1 nhân viên' }),
  type: nativeEnum(ContractType),
  start_date: coerce.date({ message: 'Vui lòng chọn ngày bắt đầu hợp đồng' }),
  end_date: coerce.date({ message: 'Vui lòng chọn ngày kết thúc hợp đồng' }),
  signed_date: coerce.date({ message: 'Vui lòng chọn ngày ký hợp đồng' }),
  salary_agreement: number({ invalid_type_error: 'Vui lòng tiền lương 2 bên đã thỏa thuận' }),
  file_path: string({ required_error: 'Vui lòng tải lên file hợp đồng' }),
  remark: string().optional(),
})

export type TCreateContractSchema = typeof createContractSchema

export type TCreateContractValues = Infer<typeof createContractSchema>
