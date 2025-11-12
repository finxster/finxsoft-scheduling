<template>
  <div
    :class="[
      'animate-pulse bg-gray-200 rounded',
      circleClass,
      customClass
    ]"
    :style="{ width, height }"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '1rem'
  },
  circle: {
    type: Boolean,
    default: false
  },
  customClass: {
    type: String,
    default: ''
  }
})

const circleClass = computed(() => {
  return props.circle ? 'rounded-full' : ''
})
</script>
