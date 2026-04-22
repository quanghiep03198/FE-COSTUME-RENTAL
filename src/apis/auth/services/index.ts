import { useAuthStore } from '@/apis/auth/stores'
import type { IUser } from '@/apis/user/types'
import { UnauthorizedError } from '@/common/errors'
import { axiosClient } from '@/configs/axios.config'
import type { AxiosError } from 'axios'
import { isNil } from 'lodash-es'
import { getTokenFn } from '../functions'
import type { TLoginValues } from '../schemas/login.schema'
import type { TLoginResponse } from '../types'

export class AuthService {
  public static async login(payload: TLoginValues) {
    return await axiosClient.post<
      AxiosError<ResponseBody<null>>,
      ResponseBody<TLoginResponse>,
      TLoginValues
    >('/auth/login', payload)
  }

  public static async profile() {
    return await axiosClient.get<void, IUser>(`/auth/me`)
  }

  public static getAccessToken() {
    return getTokenFn()
  }

  public static async revokeToken() {
    return await axiosClient.post<undefined, any>('/auth/logout')
  }

  public static async refreshToken(signal: AbortSignal) {
    const { accessToken } = await axiosClient.get<
      void,
      { accessToken: string }
    >('/auth/refresh', {
      signal,
    })

    if (isNil(accessToken)) throw new UnauthorizedError('Xác thực thất bại')

    // Client: gọi qua RPC bridge (createServerFn) để set httpOnly cookie trên server
    //  await setCookieTokenFn({ data: accessToken })
    // Đồng bộ vào Zustand để request interceptor đọc được token mới ngay lập tức
    useAuthStore.getState().setAccessToken(accessToken)

    return accessToken
  }
}
