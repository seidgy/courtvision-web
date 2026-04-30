<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  color?: 'orange' | 'gray' | 'red' | 'green' | 'blue' | 'yellow' | 'white' | 'purple'
  variant?: 'solid' | 'soft' | 'subtle'
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'gray',
  variant: 'soft',
  size: 'md',
})

const sizeClasses: Record<string, string> = {
  xs: 'px-1.5 py-0.5 text-xs',
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
  lg: 'px-3 py-1 text-sm',
}

const colorVariants: Record<string, Record<string, string>> = {
  solid: {
    orange: 'bg-orange-500 text-white',
    gray: 'bg-gray-600 text-white',
    red: 'bg-red-600 text-white',
    green: 'bg-green-600 text-white',
    blue: 'bg-blue-600 text-white',
    yellow: 'bg-yellow-500 text-white',
    white: 'bg-white text-gray-900',
    purple: 'bg-purple-600 text-white',
  },
  soft: {
    orange: 'bg-orange-500/10 text-orange-500',
    gray: 'bg-gray-700/50 text-gray-300',
    red: 'bg-red-500/10 text-red-500',
    green: 'bg-green-500/10 text-green-500',
    blue: 'bg-blue-500/10 text-blue-500',
    yellow: 'bg-yellow-500/10 text-yellow-500',
    white: 'bg-white/10 text-white',
    purple: 'bg-purple-500/10 text-purple-500',
  },
  subtle: {
    orange: 'text-orange-500',
    gray: 'text-gray-400',
    red: 'text-red-500',
    green: 'text-green-500',
    blue: 'text-blue-500',
    yellow: 'text-yellow-500',
    white: 'text-white',
    purple: 'text-purple-500',
  },
}

const badgeClasses = computed(() => {
  const base = 'inline-flex items-center font-medium rounded-full'
  const size = sizeClasses[props.size] || sizeClasses.md
  const color = colorVariants[props.variant]?.[props.color] || colorVariants.soft.gray
  return [base, size, color].join(' ')
})
</script>
