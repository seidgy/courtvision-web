import type { ApiResponse } from '~/types'

interface ApiService {
  get<T>(url: string, config?: any): Promise<T>
  post<T>(url: string, data?: any, config?: any): Promise<T>
  put<T>(url: string, data?: any, config?: any): Promise<T>
  patch<T>(url: string, data?: any, config?: any): Promise<T>
  delete<T>(url: string, config?: any): Promise<T>
  getPaginated<T>(url: string, config?: any): Promise<ApiResponse<T>>
  postPaginated<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>
}

declare module '#app' {
  interface NuxtApp {
    $api: ApiService
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $api: ApiService
  }
}

export {}
