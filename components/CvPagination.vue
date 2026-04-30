<template>
  <div class="flex items-center space-x-1">
    <CvButton
      color="gray"
      variant="ghost"
      size="sm"
      icon="i-heroicons-chevron-left"
      :disabled="currentPage <= 1"
      @click="goToPage(currentPage - 1)"
    />
    
    <CvButton
      v-for="p in visiblePages"
      :key="p"
      :color="p === currentPage ? 'orange' : 'gray'"
      :variant="p === currentPage ? 'solid' : 'ghost'"
      size="sm"
      @click="goToPage(p)"
    >
      {{ p }}
    </CvButton>
    
    <CvButton
      color="gray"
      variant="ghost"
      size="sm"
      icon="i-heroicons-chevron-right"
      :disabled="currentPage >= totalPages"
      @click="goToPage(currentPage + 1)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: number
  total: number
  pageCount: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const currentPage = computed(() => props.modelValue)
const totalPages = computed(() => Math.ceil(props.total / props.pageCount))

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  const half = Math.floor(maxVisible / 2)
  
  let start = Math.max(1, currentPage.value - half)
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    emit('update:modelValue', page)
  }
}
</script>
