import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: any[]
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

class ApiService {
  private client: AxiosInstance

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Interceptor para adicionar token
    this.client.interceptors.request.use((config) => {
      if (process.client) {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
      return config
    })

    // Interceptor para tratamento de erros
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        // Token expirado ou inválido
        if (error.response?.status === 401) {
          if (process.client) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
          }
        }
        return Promise.reject(error)
      }
    )
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: ApiResponse<T> = await this.client.get(url, config)
    return response.data as T
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: ApiResponse<T> = await this.client.post(url, data, config)
    return response.data as T
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: ApiResponse<T> = await this.client.put(url, data, config)
    return response.data as T
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: ApiResponse<T> = await this.client.patch(url, data, config)
    return response.data as T
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: ApiResponse<T> = await this.client.delete(url, config)
    return response.data as T
  }

  async getPaginated<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.client.get(url, config)
  }

  async postPaginated<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.client.post(url, data, config)
  }
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const api = new ApiService(config.public.apiBaseUrl)

  return {
    provide: {
      api,
    },
  }
})
