import type { ContractType } from '../constants'

export interface IContract extends IBaseEntity {
  employee_id: number
  type: ContractType
  start_date: Date
  end_date: Date
  signed_date: Date
  salary_agreement: number
  file_path: string
}
