import type { IUser } from '@/apis/user/types'

export type TLoginResponse = {
  accessToken: string
  user: IUser
  // accessToken: string
  // token_type: 'bearer'
  // expires_in: number
}
