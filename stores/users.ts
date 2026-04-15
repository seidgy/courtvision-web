import { defineStore } from 'pinia'
import type { User } from '~/types'

interface UsersState {
  users: User[]
  currentUser: User | null
  loading: boolean
  error: string | null
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  } | null
}

export const useUsersStore = defineStore('users', {
  state: (): UsersState => ({
    users: [],
    currentUser: null,
    loading: false,
    error: null,
    meta: null,
  }),

  getters: {
    getUserById: (state) => (id: string) => {
      return state.users.find(u => u.id === id)
    },
    activeUsers: (state) => {
      return state.users.filter(u => u.isActive)
    },
    inactiveUsers: (state) => {
      return state.users.filter(u => !u.isActive)
    },
  },

  actions: {
    // Listar usuários
    async fetchUsers(params?: {
      page?: number
      limit?: number
      search?: string
    }) {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api.get('/users', { params })
        
        this.users = response.data || []
        this.meta = response.meta || null
        
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Erro ao carregar usuários'
        return []
      } finally {
        this.loading = false
      }
    },

    // Obter usuário por ID
    async fetchUser(id: string) {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api.get(`/users/${id}`)
        
        this.currentUser = response
        
        return response
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Erro ao carregar usuário'
        return null
      } finally {
        this.loading = false
      }
    },

    // Criar usuário
    async createUser(data: {
      email: string
      password: string
      name: string
      role?: string
    }) {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api.post('/users', data)
        
        this.users.unshift(response)
        
        return response
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Erro ao criar usuário'
        return null
      } finally {
        this.loading = false
      }
    },

    // Atualizar usuário
    async updateUser(id: string, data: {
      name?: string
      email?: string
      role?: string
      isActive?: boolean
    }) {
      this.loading = true
      
      try {
        const { $api } = useNuxtApp()
        const response = await $api.put(`/users/${id}`, data)
        
        // Atualizar na lista
        const index = this.users.findIndex(u => u.id === id)
        if (index !== -1) {
          this.users[index] = response
        }
        
        return response
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Erro ao atualizar usuário'
        return null
      } finally {
        this.loading = false
      }
    },

    // Resetar senha
    async resetPassword(id: string, newPassword: string) {
      this.loading = true
      
      try {
        const { $api } = useNuxtApp()
        await $api.post(`/users/${id}/reset-password`, { newPassword })
        
        return true
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Erro ao resetar senha'
        return false
      } finally {
        this.loading = false
      }
    },

    // Deletar usuário
    async deleteUser(id: string) {
      this.loading = true
      
      try {
        const { $api } = useNuxtApp()
        await $api.delete(`/users/${id}`)
        
        // Remover da lista
        this.users = this.users.filter(u => u.id !== id)
        
        return true
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Erro ao deletar usuário'
        return false
      } finally {
        this.loading = false
      }
    },

    // Toggle status do usuário
    async toggleUserStatus(id: string) {
      this.loading = true
      
      try {
        const { $api } = useNuxtApp()
        const response = await $api.patch(`/users/${id}/toggle-status`)
        
        // Atualizar na lista
        const index = this.users.findIndex(u => u.id === id)
        if (index !== -1) {
          this.users[index] = response
        }
        
        return response
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Erro ao alterar status'
        return null
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
