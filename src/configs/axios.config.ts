import { getTokenFn, setTokenFn } from '@/apis/auth/functions'
import { RequestHeaders } from '@/common/constants/enums'
import env from '@/lib/utils'
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
  private unauthorizedRequestHandlers: Array<PromiseExecutor<string | null>> =
    []
  private __refreshToken: Promise<string> | null = null

  constructor(baseURL: string, version: string = '1.0') {
    // * Instance configuration
    this.instance = axios.create({
      baseURL: baseURL,
      timeout: 10_000,
      withCredentials: true,
      headers: {
        [RequestHeaders.CONTENT_TYPE]: 'application/json',
        [RequestHeaders.API_VERSION]: version,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params, {
          skipNulls: true,
          format: 'RFC1738', // use RFC1738 to encode spaces as '+'
        })
      },
    })
    // * Instance request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        const accessToken = getTokenFn()
        console.log('accessToken', accessToken)
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

        if (
          originalRequest &&
          !originalRequest.retry &&
          errorStatus === HttpStatusCode.Unauthorized
        ) {
          // * Client-side: axiosInstance là singleton → queue hoạt động đúng
          if (this.isRefreshingToken) {
            return new Promise((resolve, reject) => {
              this.unauthorizedRequestHandlers.push({ resolve, reject })
            })
              .then((accessToken) => {
                originalRequest.headers[RequestHeaders.AUTHORIZATION] =
                  `Bearer ${accessToken}`
                return this.instance(originalRequest)
              })
              .catch((err) => Promise.reject(err))
          }

          this.isRefreshingToken = true

          try {
            const accessToken = await this.refreshToken()
            if (!accessToken) throw new AxiosError('Cannot get access token')
            setTokenFn(accessToken)
            this.processQueue(null, accessToken)
            originalRequest.retry = true
            return this.instance(originalRequest)
          } catch (err) {
            if (err instanceof AxiosError) this.processQueue(err, null)
            throw err
          } finally {
            this.isRefreshingToken = false
          }
        }

        throw error
      }
    )
  }

  private async refreshToken() {
    if (this.__refreshToken) return this.__refreshToken
    this.__refreshToken = axios
      .get(`${env<string>('VITE_BASE_API_URL')}/auth/refresh`, {
        headers: { Authorization: `Bearer ${getTokenFn()}` },
      })
      .then((response) => {
        const accessToken: string = response.data.accessToken
        if (!accessToken) throw new AxiosError('Cannot get access token')
        setTokenFn(accessToken)
        return accessToken
      })
      .finally(() => {
        this.__refreshToken = null
      })

    return this.__refreshToken
  }

  private processQueue(error: AxiosError | null, accessToken: string | null) {
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

export const { instance: axiosClient } = new AxiosService(
  GlobalConfig.BASE_API_URL!
)
// export const { instance: axiosServer } = new AxiosService('http://localhost:5000/api')
