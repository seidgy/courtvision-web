import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

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
    const response = await this.client.get<ApiResponse<T>>(url, config)
    return (response as any).data || response
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config)
    return (response as any).data || response
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config)
    return (response as any).data || response
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config)
    return (response as any).data || response
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url, config)
    return (response as any).data || response
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
