export declare global {
  type RuntimeEnvironment = 'production' | 'development' | 'test'

  interface InternalImportMetaEnv {
    // * Application
    readonly VITE_NODE_ENV: RuntimeEnvironment
    readonly VITE_BASE_API_URL: string
  }

  type Parameter<T> = T extends (param: infer Argument, ...rest: any) => any
    ? Argument
    : never

  interface IBaseEntity {
    id: number
    is_active: boolean
    slug?: string
    code?: string
    created_at?: Date
    updated_at?: Date
    remark: string
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
}
