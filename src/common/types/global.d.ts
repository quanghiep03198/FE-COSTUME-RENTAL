import { type IncomingHttpHeaders } from 'http'
import type { HttpStatusCode } from '../constants/http-code'

export declare global {
  type RuntimeEnvironment = 'production' | 'development' | 'test'

  interface InternalImportMetaEnv {
    // * Application
    readonly VITE_NODE_ENV: RuntimeEnvironment
    readonly VITE_PROXY_SERVER_URL: `${'http' | 'https'}://${string}`
    readonly VITE_EXTERNAL_API_URL: `${'http' | 'https'}://${string}/api`
    readonly VITE_BASE_IMAGE_URL: `${'http' | 'https'}://${string}/upload`
  }

  type Parameter<T> = T extends (param: infer Argument, ...rest: any) => any ? Argument : never

  interface IBaseEntity {
    id: number
    is_active: boolean
    slug?: string
    code?: string
    created_at?: Date
    updated_at?: Date
    remark: string
  }

  interface Pagination<T = any> {
    hasNextPage: boolean
    hasPrevPage: boolean
    nextPage: number | null
    prevPage: number | null
    totalPages: number
    totalDocs: number
    limit: number
    page: number
    data: T[]
  }

  interface ResponseBody<T> {
    message: string
    statusCode: HttpStatusCode
    metadata: T | null
    path: string
    stack?: string
    timestamp: Date
  }

  type Nullable<T> = T & (null | undefined)

  type AnonymousFunction = (...args: any[]) => any

  type RequestQueryKey =
    | `${string}:${'lt' | 'lte' | 'gt' | 'gte' | 'eq' | 'ne' | 'in' | 'contains' | 'startsWith' | 'endsWith'}`
    | `_embed`
    | '_expand'
    | '_per_page'
    | '_page'
    | '_sort'
    | '_where'

  type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS'

  interface RequestQuery {
    [key: RequestQueryKey]: string | number | boolean
  }

  type RequestHeaders = {
    // copy every declared property from http.IncomingHttpHeaders
    // but remove index signatures
    [K in keyof IncomingHttpHeaders as string extends K ? never : number extends K ? never : K]: IncomingHttpHeaders[K]
  }
}
