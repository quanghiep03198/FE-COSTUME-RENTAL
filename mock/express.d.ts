import type { IUser } from '@/apis/user/types'

module 'express' {
  interface Request {
    user?: Pick<IUser, 'id' | 'username' | 'role'> // Adjust the type as needed
    token?: string
  }
}
