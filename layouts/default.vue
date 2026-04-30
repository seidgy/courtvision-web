<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Navbar -->
    <nav class="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink to="/dashboard" class="flex items-center space-x-2">
              <div class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <CvIcon name="i-heroicons-basketball" class="w-6 h-6 text-white" />
              </div>
              <span class="text-xl font-bold text-white hidden sm:block">
                Court<span class="text-orange-500">Vision</span>
              </span>
            </NuxtLink>
          </div>

          <!-- Menu Desktop -->
          <div class="hidden md:flex items-center space-x-4">
            <NuxtLink
              v-for="item in menuItems"
              :key="item.path"
              :to="item.path"
              class="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
              :class="{ 'bg-gray-700 text-white': $route.path === item.path }"
            >
              <CvIcon :name="item.icon" class="w-5 h-5" />
              <span>{{ item.label }}</span>
            </NuxtLink>
          </div>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <!-- Notificações -->
            <CvButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-bell"
              class="relative"
            >
              <span class="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full"></span>
            </CvButton>

            <!-- User Dropdown -->
            <CvDropdown
              :items="userMenuItems"
              placement="bottom-end"
            >
              <CvButton
                color="gray"
                variant="ghost"
                class="flex items-center space-x-2"
              >
                <CvAvatar
                  :text="userInitials"
                  size="sm"
                  class="bg-orange-500"
                />
                <span class="hidden sm:block">{{ authStore.userName }}</span>
                <CvIcon name="i-heroicons-chevron-down" class="w-4 h-4" />
              </CvButton>
            </CvDropdown>

            <!-- Mobile Menu Button -->
            <CvButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-bars-3"
              class="md:hidden"
              @click="isMobileMenuOpen = !isMobileMenuOpen"
            />
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div
        v-if="isMobileMenuOpen"
        class="md:hidden bg-gray-800 border-t border-gray-700"
      >
        <div class="px-2 pt-2 pb-3 space-y-1">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            :class="{ 'bg-gray-700 text-white': $route.path === item.path }"
            @click="isMobileMenuOpen = false"
          >
            <CvIcon :name="item.icon" class="w-5 h-5" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 border-t border-gray-700 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 text-sm">
            © 2024 CourtVision AI. Todos os direitos reservados.
          </p>
          <div class="flex items-center space-x-4 mt-4 md:mt-0">
            <span class="text-gray-500 text-sm">Powered by</span>
            <span class="text-orange-500 font-medium">Kimi AI</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const route = useRoute()
const isMobileMenuOpen = ref(false)

// Inicializar auth
onMounted(() => {
  authStore.initAuth()
})

// Menu items
const menuItems = computed(() => [
  { path: '/dashboard', label: 'Dashboard', icon: 'i-heroicons-home' },
  { path: '/games', label: 'Jogos', icon: 'i-heroicons-calendar' },
  { path: '/parlays', label: 'Meus Parlays', icon: 'i-heroicons-ticket' },
  ...(authStore.isAdmin ? [{ path: '/admin', label: 'Admin', icon: 'i-heroicons-shield-check' }] : []),
])

// User menu items
const userMenuItems = computed(() => [
  [
    {
      label: 'Perfil',
      icon: 'i-heroicons-user',
      click: () => navigateTo('/profile'),
    },
    {
      label: 'Configurações',
      icon: 'i-heroicons-cog-6-tooth',
      click: () => navigateTo('/settings'),
    },
  ],
  [
    {
      label: 'Sair',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      click: () => authStore.logout(),
    },
  ],
])

// User initials
const userInitials = computed(() => {
  const name = authStore.userName
  if (!name) return 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})
</script>
