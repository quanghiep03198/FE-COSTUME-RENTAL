import { getTokenFn, setTokenFn } from '@/apis/auth/functions/auth.function'
import { logOutFn } from '@/apis/auth/rpc/logout'
import { RequestHeaders } from '@/common/constants/enums'
import env from '@/lib/utils'
import { useAuthStore } from '@/stores/auth.store'
import type { AxiosInstance } from 'axios'
import axios, { AxiosError, HttpStatusCode } from 'axios'
import qs from 'qs'
import { GlobalConfig } from './global.config'

type PromiseExecutor<T = unknown> = {
  resolve: (value: T) => void
  reject: (reason?: unknown) => void
}

export class AxiosService {
  public instance: AxiosInstance
  private isRefreshingToken = false
  private unauthorizedRequestHandlers: Array<PromiseExecutor<string | null>> = []
  private refreshTokenHandler: Promise<string> | null = null

  constructor(baseURL: string, version: string = '1.0') {
    // * Instance configuration
    this.instance = axios.create({
      baseURL: baseURL,
      timeout: 10_000,
      headers: {
        [RequestHeaders.CONTENT_TYPE]: 'application/json',
        [RequestHeaders.API_VERSION]: version,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, {
          skipNulls: false,
          format: 'RFC1738', // use RFC1738 to encode spaces as '+'
        })
      },
    })
    // * Instance request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // if (config.headers[RequestHeaders.AUTHORIZATION]) return config
        const accessToken = getTokenFn()
        if (!accessToken) return config
        config.headers[RequestHeaders.AUTHORIZATION] = `Bearer ${accessToken}`

        return config
      },
      (error) => Promise.reject(error)
    )
    // * Instance response interceptor
    this.instance.interceptors.response.use(
      (response) => response.data,
      async (error: AxiosError<any>) => {
        const originalRequest = error.config
        const errorStatus = error.response?.status

        if (originalRequest && !originalRequest.retry && errorStatus === HttpStatusCode.Unauthorized) {
          // * Client-side: axiosInstance là singleton → queue hoạt động đúng
          if (this.isRefreshingToken) {
            return new Promise((resolve, reject) => {
              this.unauthorizedRequestHandlers.push({ resolve, reject })
            })
              .then((accessToken) => {
                originalRequest.headers[RequestHeaders.AUTHORIZATION] = `Bearer ${accessToken}`
                return this.instance(originalRequest)
              })
              .catch((err) => Promise.reject(err))
          }

          try {
            const accessToken = await this.refreshToken()
            if (!accessToken) throw new AxiosError('Cannot get access token')
            this.processQueue(null, accessToken)
            originalRequest.retry = true
            originalRequest.headers[RequestHeaders.AUTHORIZATION] = `Bearer ${accessToken}`
            return this.instance(originalRequest)
          } catch (err) {
            await axios.post(env('VITE_EXTERNAL_API_URL') + '/auth/logout', {
              headers: {
                [RequestHeaders.AUTHORIZATION]: originalRequest.headers[RequestHeaders.AUTHORIZATION],
              },
            })
            await logOutFn()
            useAuthStore.getState().resetCredentials()

            this.processQueue(err instanceof AxiosError ? err : new AxiosError('Token refresh failed'), null)
            throw err
          }
        }

        throw error
      }
    )
  }

  /**
   * * Singleton refresh token handler
   * @returns
   */
  private async refreshToken() {
    if (this.refreshTokenHandler) return this.refreshTokenHandler
    this.isRefreshingToken = true
    const baseURL = env<string>('VITE_EXTERNAL_API_URL')

    this.refreshTokenHandler = axios
      .get(`${baseURL}/auth/refresh`, {
        withCredentials: true,
      })
      .then(async (response) => {
        const accessToken: string = response.data.accessToken
        if (!accessToken) throw new AxiosError('Cannot get access token')
        await setTokenFn(accessToken) // Đồng bộ token lên cookie để mock server có thể kiểm tra
        return accessToken
      })
      .finally(() => {
        this.refreshTokenHandler = null
        this.isRefreshingToken = false
      })

    return this.refreshTokenHandler
  }

  public processQueue(error: AxiosError | null, accessToken: string | null) {
    this.unauthorizedRequestHandlers.forEach((promise) => {
      if (error) {
        promise.reject(error)
      } else {
        promise.resolve(accessToken)
      }
    })
    this.unauthorizedRequestHandlers = []
  }
}

export const { instance: axiosClient } = new AxiosService(GlobalConfig.BASE_API_URL!)
// export const { instance: axiosClient } = new AxiosService('http://localhost:5000/api')
