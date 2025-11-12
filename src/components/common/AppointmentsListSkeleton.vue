<template>
  <div class="space-y-4">
    <div v-for="i in itemCount" :key="i" class="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      <!-- Header with date and status -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex-1">
          <SkeletonLoader width="150px" height="18px" class="mb-2" />
          <SkeletonLoader width="200px" height="16px" />
        </div>
        <SkeletonLoader width="100px" height="24px" />
      </div>
      
      <!-- Customer info -->
      <div class="mb-3 flex items-center gap-2">
        <SkeletonLoader width="40px" height="40px" circle />
        <div class="flex-1">
          <SkeletonLoader width="120px" height="16px" class="mb-1" />
          <SkeletonLoader width="100px" height="14px" />
        </div>
      </div>
      
      <!-- Service info -->
      <div class="mb-4 p-3 bg-blue-50 rounded">
        <SkeletonLoader width="100px" height="16px" class="mb-2" />
        <SkeletonLoader width="180px" height="14px" />
      </div>
      
      <!-- Action buttons -->
      <div class="flex gap-2">
        <SkeletonLoader width="100px" height="36px" />
        <SkeletonLoader width="100px" height="36px" />
      </div>
    </div>
  </div>
</template>

<script setup>
import SkeletonLoader from './SkeletonLoader.vue'

defineProps({
  itemCount: {
    type: Number,
    default: 5
  }
})
</script>
