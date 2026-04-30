<template>
  <div
    class="flex items-start gap-3 p-4 rounded-lg"
    :class="alertClasses"
    role="alert"
  >
    <CvIcon v-if="icon" :name="icon" class="w-5 h-5 shrink-0 mt-0.5" />
    <div class="flex-1">
      <h3 v-if="title" class="font-medium">{{ title }}</h3>
      <div v-if="$slots.default" class="mt-1 text-sm opacity-90">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  color?: 'orange' | 'gray' | 'red' | 'green' | 'blue' | 'yellow' | 'white'
  variant?: 'solid' | 'soft' | 'subtle' | 'outline'
  icon?: string
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue',
  variant: 'soft',
})

const colorVariants: Record<string, Record<string, string>> = {
  solid: {
    orange: 'bg-orange-500 text-white',
    gray: 'bg-gray-600 text-white',
    red: 'bg-red-600 text-white',
    green: 'bg-green-600 text-white',
    blue: 'bg-blue-600 text-white',
    yellow: 'bg-yellow-500 text-white',
    white: 'bg-white text-gray-900',
  },
  soft: {
    orange: 'bg-orange-500/10 text-orange-500 border border-orange-500/20',
    gray: 'bg-gray-700/50 text-gray-300 border border-gray-600/50',
    red: 'bg-red-500/10 text-red-500 border border-red-500/20',
    green: 'bg-green-500/10 text-green-500 border border-green-500/20',
    blue: 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
    white: 'bg-white/10 text-white border border-white/20',
  },
  subtle: {
    orange: 'text-orange-500',
    gray: 'text-gray-400',
    red: 'text-red-500',
    green: 'text-green-500',
    blue: 'text-blue-500',
    yellow: 'text-yellow-500',
    white: 'text-white',
  },
  outline: {
    orange: 'border border-orange-500 text-orange-500',
    gray: 'border border-gray-600 text-gray-300',
    red: 'border border-red-500 text-red-500',
    green: 'border border-green-500 text-green-500',
    blue: 'border border-blue-500 text-blue-500',
    yellow: 'border border-yellow-500 text-yellow-500',
    white: 'border border-white text-white',
  },
}

const alertClasses = computed(() => {
  return colorVariants[props.variant]?.[props.color] || colorVariants.soft.blue
})
</script>
