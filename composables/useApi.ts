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

