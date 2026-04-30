<template>
  <component
    :is="iconComponent"
    v-if="iconComponent"
    :class="iconClass"
    aria-hidden="true"
  />
  <span v-else :class="iconClass">?</span>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'

// Heroicons - 24px Outline
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  ArrowRightIcon,
  ArrowRightOnRectangleIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ArrowUpIcon,
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartBarIcon,
  ChartPieIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  Cog6ToothIcon,
  EllipsisVerticalIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  HomeIcon,
  KeyIcon,
  LightBulbIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  MinusCircleIcon,
  MinusIcon,
  PencilSquareIcon,
  PercentBadgeIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
  ShareIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TicketIcon,
  TrashIcon,
  UserGroupIcon,
  UserIcon,
  UsersIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

// Custom mapping for basketball (not in heroicons)
const BasketballIcon = {
  render() {
    return h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24',
      'stroke-width': 1.5,
      stroke: 'currentColor',
      class: this.$attrs.class || 'w-6 h-6',
    }, [
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 2.25c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12 6.615 2.25 12 2.25z' }),
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 2.25c2.25 3 3.75 6.75 3.75 9.75s-1.5 6.75-3.75 9.75' }),
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 2.25c-2.25 3-3.75 6.75-3.75 9.75s1.5 6.75 3.75 9.75' }),
      h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M2.25 12h19.5' }),
    ])
  }
}

import { h } from 'vue'

const props = defineProps<{
  name?: string
  class?: string
}>()

const iconClass = computed(() => props.class || 'w-5 h-5')

const iconMap: Record<string, Component> = {
  'i-heroicons-arrow-down': ArrowDownIcon,
  'i-heroicons-arrow-left': ArrowLeftIcon,
  'i-heroicons-arrow-path': ArrowPathIcon,
  'i-heroicons-arrow-right': ArrowRightIcon,
  'i-heroicons-arrow-right-on-rectangle': ArrowRightOnRectangleIcon,
  'i-heroicons-arrow-trending-down': ArrowTrendingDownIcon,
  'i-heroicons-arrow-trending-up': ArrowTrendingUpIcon,
  'i-heroicons-arrow-up': ArrowUpIcon,
  'i-heroicons-bars-3': Bars3Icon,
  'i-heroicons-basketball': BasketballIcon,
  'i-heroicons-bell': BellIcon,
  'i-heroicons-calendar': CalendarIcon,
  'i-heroicons-chart-bar': ChartBarIcon,
  'i-heroicons-chart-pie': ChartPieIcon,
  'i-heroicons-check': CheckIcon,
  'i-heroicons-check-circle': CheckCircleIcon,
  'i-heroicons-chevron-down': ChevronDownIcon,
  'i-heroicons-chevron-left': ChevronLeftIcon,
  'i-heroicons-chevron-right': ChevronRightIcon,
  'i-heroicons-clock': ClockIcon,
  'i-heroicons-cog-6-tooth': Cog6ToothIcon,
  'i-heroicons-ellipsis-vertical': EllipsisVerticalIcon,
  'i-heroicons-envelope': EnvelopeIcon,
  'i-heroicons-exclamation-triangle': ExclamationTriangleIcon,
  'i-heroicons-eye': EyeIcon,
  'i-heroicons-eye-slash': EyeSlashIcon,
  'i-heroicons-home': HomeIcon,
  'i-heroicons-key': KeyIcon,
  'i-heroicons-light-bulb': LightBulbIcon,
  'i-heroicons-lock-closed': LockClosedIcon,
  'i-heroicons-magnifying-glass': MagnifyingGlassIcon,
  'i-heroicons-minus': MinusIcon,
  'i-heroicons-minus-circle': MinusCircleIcon,
  'i-heroicons-pencil-square': PencilSquareIcon,
  'i-heroicons-percentage-badge': PercentBadgeIcon,
  'i-heroicons-plus': PlusIcon,
  'i-heroicons-question-mark-circle': QuestionMarkCircleIcon,
  'i-heroicons-share': ShareIcon,
  'i-heroicons-shield-check': ShieldCheckIcon,
  'i-heroicons-sparkles': SparklesIcon,
  'i-heroicons-ticket': TicketIcon,
  'i-heroicons-trash': TrashIcon,
  'i-heroicons-user': UserIcon,
  'i-heroicons-user-check': UserGroupIcon,
  'i-heroicons-users': UsersIcon,
  'i-heroicons-x-circle': XCircleIcon,
  'i-heroicons-x-mark': XMarkIcon,
}

const iconComponent = computed<Component | null>(() => {
  if (!props.name) return null
  return iconMap[props.name] || null
})
</script>
