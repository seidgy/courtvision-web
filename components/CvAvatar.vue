<template>
  <div
    class="inline-flex items-center justify-center rounded-full font-medium text-white"
    :class="[sizeClass, $attrs.class]"
  >
    <img
      v-if="src"
      :src="src"
      :alt="text || 'Avatar'"
      class="w-full h-full rounded-full object-cover"
    />
    <span v-else>{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  src?: string
  text?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const sizeClass = computed(() => {
  const sizes: Record<string, string> = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-14 h-14 text-xl',
    '2xl': 'w-16 h-16 text-2xl',
    '3xl': 'w-20 h-20 text-2xl',
  }
  return sizes[props.size] || sizes.md
})
</script>
