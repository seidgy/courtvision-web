<template>
  <form @submit.prevent="handleSubmit">
    <slot />
  </form>
</template>

<script setup lang="ts">
interface Props {
  schema?: any
  state?: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [event: any]
}>()

function handleSubmit(event: Event) {
  emit('submit', event)
}
</script>
