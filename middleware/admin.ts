import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  if (process.server) return

  const authStore = useAuthStore()
  authStore.initAuth()

  // Verificar se é admin
  if (!authStore.isAdmin) {
    return navigateTo('/dashboard')
  }
})
