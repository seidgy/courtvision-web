<template>
  <div class="relative" v-click-outside="close">
    <div @click="toggle">
      <slot />
    </div>
    
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 mt-2 w-48 rounded-lg bg-gray-800 border border-gray-700 shadow-lg py-1"
        :class="placementClass"
      >
        <template v-for="(group, gIdx) in normalizedItems" :key="gIdx">
          <div v-if="gIdx > 0" class="border-t border-gray-700 my-1" />
          <button
            v-for="item in group"
            :key="item.label"
            class="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            @click="handleItemClick(item)"
          >
            <CvIcon v-if="item.icon" :name="item.icon" class="w-4 h-4 mr-2" />
            {{ item.label }}
          </button>
        </template>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface DropdownItem {
  label: string
  icon?: string
  click?: () => void
  to?: string
}

interface Props {
  items?: DropdownItem[][] | DropdownItem[]
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  placement: 'bottom-start',
})

const isOpen = ref(false)

const normalizedItems = computed(() => {
  if (props.items.length === 0) return []
  if (Array.isArray(props.items[0])) {
    return props.items as DropdownItem[][]
  }
  return [props.items as DropdownItem[]]
})

const placementClass = computed(() => {
  const classes: Record<string, string> = {
    'bottom-start': 'left-0',
    'bottom-end': 'right-0',
    'top-start': 'left-0 bottom-full mb-2',
    'top-end': 'right-0 bottom-full mb-2',
  }
  return classes[props.placement] || classes['bottom-start']
})

function toggle() {
  isOpen.value = !isOpen.value
}

function close() {
  isOpen.value = false
}

function handleItemClick(item: DropdownItem) {
  if (item.click) item.click()
  if (item.to) navigateTo(item.to)
  close()
}

// Click outside directive
const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    const handler = (e: Event) => {
      if (!el.contains(e.target as Node)) {
        binding.value()
      }
    }
    document.addEventListener('click', handler)
    ;(el as any).__clickOutsideHandler = handler
  },
  unmounted(el: HTMLElement) {
    const handler = (el as any).__clickOutsideHandler
    if (handler) document.removeEventListener('click', handler)
  },
}
</script>
