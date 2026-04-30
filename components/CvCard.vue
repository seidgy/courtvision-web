<template>
  <div class="rounded-xl border border-gray-700 bg-gray-800 overflow-hidden" :class="$attrs.class">
    <div v-if="$slots.header" class="px-4 py-3 border-b border-gray-700">
      <slot name="header" />
    </div>
    <div class="p-4">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-4 py-3 border-t border-gray-700">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Simple card component with header/body/footer slots
</script>
