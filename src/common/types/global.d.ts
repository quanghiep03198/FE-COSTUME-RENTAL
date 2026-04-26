import type { AxiosRequestConfig } from "axios"

export declare global {
  type RuntimeEnvironment = 'production' | 'development' | 'test'

  interface InternalImportMetaEnv {
    // * Application
    readonly VITE_NODE_ENV: RuntimeEnvironment
    readonly VITE_BASE_API_URL: string
    readonly VITE_BASE_IMAGE_URL: string
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

  interface Pagination<T = any>{
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

  type AnonymousFunction = (...args: any[]) => any

  type RequestQueryKey =
    | `${string}:${'lt' | 'lte' | 'gt' | 'gte' | 'eq' | 'ne' | 'in' | 'contains' | 'startsWith' | 'endsWith'}`
    | `_embed`
    | '_expand'
    | '_per_page'
    | '_page'
    | '_sort'
    | '_where'

  interface RequestQuery extends AxiosRequestConfig['params']{
    [key: RequestQueryKey]: string | number | boolean
  }
}
