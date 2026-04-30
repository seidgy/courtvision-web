<template>
  <div>
    <div class="flex space-x-1 border-b border-gray-700">
      <button
        v-for="item in items"
        :key="item.key || item.label"
        :class="[
          'px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px',
          (modelValue || items[0]?.key) === item.key
            ? 'border-orange-500 text-orange-500'
            : 'border-transparent text-gray-400 hover:text-gray-300',
        ]"
        @click="$emit('update:modelValue', item.key)"
      >
        <div class="flex items-center space-x-2">
          <CvIcon v-if="item.icon" :name="item.icon" class="w-4 h-4" />
          <span>{{ item.label }}</span>
        </div>
      </button>
    </div>
    <div class="mt-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface TabItem {
  key: string
  label: string
  icon?: string
}

interface Props {
  items: TabItem[]
  modelValue?: string
}

defineProps<Props>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
