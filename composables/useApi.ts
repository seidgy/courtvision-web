import type { ApiResponse } from '~/types'

export const useApi = () => {
  const { $api } = useNuxtApp()
  return $api
}

export const useAuth = () => {
  const authStore = useAuthStore()
  
  return {
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isAdmin: computed(() => authStore.isAdmin),
    user: computed(() => authStore.user),
    login: authStore.login,
    logout: authStore.logout,
    fetchProfile: authStore.fetchProfile,
  }
}

export const useToast = () => {
  const toast = useToast()
  
  return {
    success: (message: string) => {
      toast.add({
        title: 'Sucesso',
        description: message,
        color: 'green',
        icon: 'i-heroicons-check-circle',
      })
    },
    error: (message: string) => {
      toast.add({
        title: 'Erro',
        description: message,
        color: 'red',
        icon: 'i-heroicons-exclamation-triangle',
      })
    },
    info: (message: string) => {
      toast.add({
        title: 'Informação',
        description: message,
        color: 'blue',
        icon: 'i-heroicons-information-circle',
      })
    },
  }
}
