import { defineStore } from 'pinia'
import type { User, LoginCredentials, AuthResponse } from '~/types'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    isAdmin: (state) => state.user?.role === 'ADMIN',
    userName: (state) => state.user?.name || '',
    userEmail: (state) => state.user?.email || '',
  },

  actions: {
    // Inicializar auth do localStorage
    initAuth() {
      if (process.client) {
        const token = localStorage.getItem('token')
        const user = localStorage.getItem('user')
        
        if (token && user) {
          this.token = token
          this.user = JSON.parse(user)
        }
      }
    },

    // Login
    async login(credentials: LoginCredentials) {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api.post<AuthResponse>('/auth/login', credentials)
        
        this.user = response.user
        this.token = response.token

        // Salvar no localStorage
        if (process.client) {
          localStorage.setItem('token', response.token)
          localStorage.setItem('user', JSON.stringify(response.user))
        }

        return true
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Erro ao realizar login'
        return false
      } finally {
        this.loading = false
      }
    },

    // Logout
    logout() {
      this.user = null
      this.token = null
      this.error = null

      if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }

      navigateTo('/login')
    },

    // Obter perfil
    async fetchProfile() {
      try {
        const { $api } = useNuxtApp()
        const response = await $api.get('/auth/profile')
        this.user = response
        
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(response))
        }
        
        return response
      } catch (error) {
        console.error('Erro ao obter perfil:', error)
        return null
      }
    },

    // Atualizar perfil
    async updateProfile(data: { name: string; email: string }) {
      this.loading = true
      
      try {
        const { $api } = useNuxtApp()
        const response = await $api.put('/auth/profile', data)
        this.user = response
        
        if (process.client) {
          localStorage.setItem('user', JSON.stringify(response))
        }
        
        return true
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Erro ao atualizar perfil'
        return false
      } finally {
        this.loading = false
      }
    },

    // Alterar senha
    async changePassword(currentPassword: string, newPassword: string) {
      this.loading = true
      
      try {
        const { $api } = useNuxtApp()
        await $api.post('/auth/change-password', {
          currentPassword,
          newPassword,
        })
        
        return true
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Erro ao alterar senha'
        return false
      } finally {
        this.loading = false
      }
    },

    // Limpar erro
    clearError() {
      this.error = null
    },
  },
})
