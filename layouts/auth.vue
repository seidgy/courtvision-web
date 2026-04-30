<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
          <CvIcon name="i-heroicons-basketball" class="w-12 h-12 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-white">
          Court<span class="text-orange-500">Vision</span>
        </h1>
        <p class="text-gray-400 mt-2">
          Análise estatística com IA
        </p>
      </div>

      <!-- Content -->
      <div class="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700 shadow-2xl">
        <slot />
      </div>

      <!-- Footer -->
      <p class="text-center text-gray-500 text-sm mt-8">
        © 2024 CourtVision AI. Powered by Inteligência Artificial.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Layout para páginas de autenticação
</script>
