import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  // Verificar se estamos no cliente
  if (process.server) return

  const authStore = useAuthStore()
  
  // Inicializar auth
  authStore.initAuth()

  // Rotas públicas
  const publicRoutes = ['/login', '/register', '/forgot-password']
  
  // Se não estiver autenticado e tentar acessar rota protegida
  if (!authStore.isAuthenticated && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }

  // Se estiver autenticado e tentar acessar login
  if (authStore.isAuthenticated && to.path === '/login') {
    return navigateTo('/dashboard')
  }

  // Verificar rotas de admin
  if (to.path.startsWith('/admin') && !authStore.isAdmin) {
    return navigateTo('/dashboard')
  }
})
