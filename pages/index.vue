<template>
  <div />
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

// Redirecionamento é tratado pelo middleware auth.ts
// - Não autenticado → /login
// - Autenticado → /dashboard
</script>
