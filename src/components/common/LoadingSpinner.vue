<template>
  <div class="flex items-center justify-center">
    <div :class="spinnerClasses"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  }
})

const spinnerClasses = computed(() => {
  const base = 'animate-spin rounded-full border-b-2 border-blue-500'
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }
  return [base, sizes[props.size]]
})
</script>
