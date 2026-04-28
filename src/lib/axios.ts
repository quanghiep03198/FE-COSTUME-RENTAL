import { RequestHeaders } from '@/common/constants/enums'
import { GlobalConfig } from '@/configs/global.config'
import axios from 'axios'

export const createAxiosInstance = (context: any) => {
  const instance = axios.create({ baseURL: GlobalConfig.BASE_API_URL })

  //   function refreshToken() {
  //     const username = context?.user?.username
  //     if (!username) return
  //     const existingLock = RefreshLockManager.getLock(username)
  //     if (existingLock) return existingLock

  //     const refreshPromise = instance
  //       .get('/auth/refresh', { withCredentials: true })
  //       .then((res) => {
  //         const accessToken = res.data.accessToken
  //         if (!accessToken) throw new AxiosError('Cannot get access token')
  //         return accessToken
  //       })
  //       .catch(() => redirect({ to: '/login' }))

  //     RefreshLockManager.setLock(username, refreshPromise)
  //     return refreshPromise
  //   }

  instance.interceptors.request.use((config) => {
    if (context.accessToken && context.user) {
      if (context?.accessToken) config.headers[RequestHeaders.AUTHORIZATION] = `Bearer ${context.accessToken}`
      if (context?.user) config.headers[RequestHeaders.REQUEST_USER] = context.user.username
    }

    return config
  })

  instance.interceptors.response.use(
    (response) => response.data
    //  async (error: AxiosError) => {
    //    const originalRequest = error.config
    //    const errorStatus = error.response?.status

    //    if (!originalRequest || originalRequest.retry || errorStatus !== HttpStatusCode.Unauthorized) {
    //      throw error
    //    }

    //    originalRequest.retry = true

    //    try {
    //      const accessToken = await refreshToken()
    //      originalRequest.headers[RequestHeaders.AUTHORIZATION] = `Bearer ${accessToken}`
    //      return instance(originalRequest) // retry với token mới
    //    } catch (err) {
    //      //   import('@/apis/auth/rpc/logout').then((module) => module.logOutFn())
    //    }
    //  }
  )

  return instance
}
