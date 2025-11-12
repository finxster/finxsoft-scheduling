<template>
  <div class="space-y-6">
    <!-- Greeting Skeleton -->
    <div>
      <SkeletonLoader width="250px" height="28px" class="mb-2" />
      <SkeletonLoader width="200px" height="20px" />
    </div>
    
    <!-- Stats Cards Skeleton -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="i in 4" :key="i" class="bg-white rounded-card shadow-card p-6 border-l-4">
        <div class="flex items-center justify-between mb-4">
          <SkeletonLoader width="32px" height="32px" circle />
        </div>
        <SkeletonLoader width="80px" height="32px" class="mb-3" />
        <SkeletonLoader width="120px" height="16px" />
      </div>
    </div>
    
    <!-- Appointments Section Skeleton -->
    <div class="bg-white rounded-card shadow-card p-6">
      <SkeletonLoader width="200px" height="24px" class="mb-6" />
      
      <!-- Appointment List Items -->
      <div class="space-y-4">
        <div v-for="i in 3" :key="i" class="p-4 border border-gray-200 rounded-lg">
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <SkeletonLoader width="150px" height="18px" class="mb-2" />
              <SkeletonLoader width="120px" height="16px" />
            </div>
            <SkeletonLoader width="80px" height="20px" />
          </div>
          <div class="flex gap-2">
            <SkeletonLoader width="100px" height="36px" />
            <SkeletonLoader width="100px" height="36px" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SkeletonLoader from './SkeletonLoader.vue'
</script>
