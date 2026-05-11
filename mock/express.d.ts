import type { IUser } from '@/apis/user/types'

module 'express' {
  interface Request {
    user?: IUser
  }
}
