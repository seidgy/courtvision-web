<template>
  <component
    :is="tag"
    :type="type"
    :disabled="disabled || loading"
    :to="to"
    :class="buttonClasses"
    @click="handleClick"
  >
    <span v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <svg class="animate-spin h-5 w-5" :class="loadingColorClass" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </span>
    <span :class="{ 'opacity-0': loading }" class="flex items-center justify-center gap-2">
      <CvIcon v-if="icon && !loading" :name="icon" :class="iconSizeClass" />
      <slot name="leading" />
      <slot />
      <slot name="trailing" />
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  color?: 'orange' | 'gray' | 'red' | 'green' | 'blue' | 'yellow' | 'white'
  variant?: 'solid' | 'soft' | 'ghost' | 'link' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  block?: boolean
  loading?: boolean
  disabled?: boolean
  icon?: string
  to?: string
  type?: 'button' | 'submit' | 'reset'
  padded?: boolean | string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'gray',
  variant: 'solid',
  size: 'md',
  block: false,
  loading: false,
  disabled: false,
  type: 'button',
  padded: true,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const tag = computed(() => props.to ? 'NuxtLink' : 'button')

const sizeClasses: Record<string, string> = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-2.5 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-4 py-2.5 text-base',
  xl: 'px-6 py-3 text-base',
}

const colorVariants: Record<string, Record<string, string>> = {
  solid: {
    orange: 'bg-orange-500 hover:bg-orange-600 text-white disabled:bg-orange-300',
    gray: 'bg-gray-700 hover:bg-gray-600 text-white disabled:bg-gray-500',
    red: 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-300',
    green: 'bg-green-600 hover:bg-green-700 text-white disabled:bg-green-300',
    blue: 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300',
    yellow: 'bg-yellow-500 hover:bg-yellow-600 text-white disabled:bg-yellow-300',
    white: 'bg-white hover:bg-gray-100 text-gray-900 disabled:bg-gray-200',
  },
  soft: {
    orange: 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 disabled:opacity-50',
    gray: 'bg-gray-700/50 hover:bg-gray-700 text-gray-300 disabled:opacity-50',
    red: 'bg-red-500/10 hover:bg-red-500/20 text-red-500 disabled:opacity-50',
    green: 'bg-green-500/10 hover:bg-green-500/20 text-green-500 disabled:opacity-50',
    blue: 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 disabled:opacity-50',
    yellow: 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 disabled:opacity-50',
    white: 'bg-white/10 hover:bg-white/20 text-white disabled:opacity-50',
  },
  ghost: {
    orange: 'hover:bg-orange-500/10 text-orange-500 disabled:opacity-50',
    gray: 'hover:bg-gray-700 text-gray-300 disabled:opacity-50',
    red: 'hover:bg-red-500/10 text-red-500 disabled:opacity-50',
    green: 'hover:bg-green-500/10 text-green-500 disabled:opacity-50',
    blue: 'hover:bg-blue-500/10 text-blue-500 disabled:opacity-50',
    yellow: 'hover:bg-yellow-500/10 text-yellow-500 disabled:opacity-50',
    white: 'hover:bg-white/10 text-white disabled:opacity-50',
  },
  link: {
    orange: 'text-orange-500 hover:underline disabled:opacity-50',
    gray: 'text-gray-300 hover:underline disabled:opacity-50',
    red: 'text-red-500 hover:underline disabled:opacity-50',
    green: 'text-green-500 hover:underline disabled:opacity-50',
    blue: 'text-blue-500 hover:underline disabled:opacity-50',
    yellow: 'text-yellow-500 hover:underline disabled:opacity-50',
    white: 'text-white hover:underline disabled:opacity-50',
  },
  outline: {
    orange: 'border border-orange-500 text-orange-500 hover:bg-orange-500/10 disabled:opacity-50',
    gray: 'border border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50',
    red: 'border border-red-500 text-red-500 hover:bg-red-500/10 disabled:opacity-50',
    green: 'border border-green-500 text-green-500 hover:bg-green-500/10 disabled:opacity-50',
    blue: 'border border-blue-500 text-blue-500 hover:bg-blue-500/10 disabled:opacity-50',
    yellow: 'border border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 disabled:opacity-50',
    white: 'border border-white text-white hover:bg-white/10 disabled:opacity-50',
  },
}

const buttonClasses = computed(() => {
  const base = 'relative inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-orange-500'
  const size = sizeClasses[props.size] || sizeClasses.md
  const color = colorVariants[props.variant]?.[props.color] || colorVariants.solid.gray
  const blockClass = props.block ? 'w-full' : ''
  const paddingClass = props.padded === false ? 'p-0' : ''
  return [base, size, color, blockClass, paddingClass].filter(Boolean).join(' ')
})

const iconSizeClass = computed(() => {
  const sizes: Record<string, string> = { xs: 'w-3 h-3', sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-5 h-5', xl: 'w-6 h-6' }
  return sizes[props.size] || sizes.md
})

const loadingColorClass = computed(() => {
  return props.variant === 'solid' ? 'text-white' : `text-${props.color}-500`
})

function handleClick(e: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', e)
  }
}
</script>
