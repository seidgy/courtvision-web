<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- Toast Notifications -->
    <UNotifications />
  </div>
</template>

<script setup lang="ts">
// Configurações globais da aplicação
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | NBA Parlay Analyzer` : 'NBA Parlay Analyzer'
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
