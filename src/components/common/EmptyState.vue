<template>
  <div class="text-center py-12">
    <component v-if="icon" :is="icon" class="w-16 h-16 mx-auto text-gray-300 mb-4" />
    <Inbox v-else class="w-16 h-16 mx-auto text-gray-300 mb-4" />
    <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ title || message }}</h3>
    <p v-if="description" class="text-gray-600 mb-6">{{ description }}</p>
    <slot />
  </div>
</template>

<script setup>
import { Inbox } from 'lucide-vue-next'

defineProps({
  icon: Object,
  title: String,
  message: String,
  description: String
})
</script>
