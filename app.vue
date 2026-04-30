<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- Toast Notifications (desabilitado - Nuxt UI removido) -->
  </div>
</template>

<script setup lang="ts">
// Configurações globais da aplicação
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | CourtVision AI` : 'CourtVision AI'
  },
})

// Inicializar auth no cliente
onMounted(() => {
  if (process.client) {
    const authStore = useAuthStore()
    authStore.initAuth()
  }
})
</script>
