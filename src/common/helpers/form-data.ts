import type { AxiosRequestConfig, Method } from 'axios'

export const MULTIPART_HEADER: Pick<AxiosRequestConfig, 'headers'> = {
  headers: { 'Content-Type': 'multipart/form-data' },
}

export function createFormData(payload: Record<string, unknown> & { _method?: Method }): FormData {
  const formData = new FormData()
  const jsonFields: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(payload)) {
    if (value instanceof File) {
      formData.append(key, value)
    } else if (key === '_method' && typeof value === 'string') {
      formData.append(key, value)
    } else if (value instanceof Blob) {
      formData.append(key, value)
    } else {
      jsonFields[key] = value
    }
  }

  formData.append('data', JSON.stringify(jsonFields))

  return formData
}
