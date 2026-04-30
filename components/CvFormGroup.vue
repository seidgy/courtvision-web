<template>
  <div class="space-y-1">
    <label v-if="label" :for="name" class="block text-sm font-medium text-gray-300">
      {{ label }}
    </label>
    <div>
      <slot />
    </div>
    <p v-if="error" class="text-sm text-red-500 mt-1">{{ error }}</p>
    <p v-else-if="hint" class="text-sm text-gray-500 mt-1">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string
  name?: string
  error?: string
  hint?: string
}

defineProps<Props>()
</script>
