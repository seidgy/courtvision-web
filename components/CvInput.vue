<template>
  <div class="relative">
    <CvIcon
      v-if="icon"
      :name="icon"
      class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
    />
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      class="w-full bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
      :class="[
        sizeClasses[size || 'md'],
        icon ? 'pl-10' : 'pl-4',
        $slots.trailing ? 'pr-10' : 'pr-4',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <div
      v-if="$slots.trailing"
      class="absolute right-2 top-1/2 -translate-y-1/2"
    >
      <slot name="trailing" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number
  type?: string
  placeholder?: string
  icon?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-4 py-2.5 text-base',
  xl: 'px-6 py-3 text-base',
}
</script>
