import { UserRole } from '@/apis/auth/constants'
import { nativeEnum, number, object, string, type infer as Infer } from 'zod'

export const createUserSchema = object({
  username: string({ message: 'Tên đăng nhập không được để trống' }).min(3, 'Tên đăng nhập phải có tối thiểu 3 ký tự'),
  password: string({ message: 'Mật khẩu không được để trống' }).optional(),
  role: nativeEnum(UserRole, { message: 'Vai trò không được để trống' }),
  employee_id: object({ id: number() }),
})

export const createUserReqSchema = createUserSchema.omit({ employee_id: true }).extend({
  employee_id: number({ message: 'Nhân viên không được để trống' }),
})

export type TCreateUserSchema = typeof createUserSchema

export type TCreateUserValues = Infer<TCreateUserSchema>

export type TCreateUserReqValues = Infer<typeof createUserReqSchema>
