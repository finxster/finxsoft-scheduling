<template>
  <div class="text-center py-12">
    <AlertCircle class="w-16 h-16 mx-auto text-red-400 mb-4" />
    <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ title || t('common.errorTitle') }}</h3>
    <p class="text-gray-600 mb-6">{{ message || t('common.errorMessage') }}</p>
    <button v-if="showRetry" @click="$emit('retry')" class="btn-primary">
      {{ t('common.retry') }}
    </button>
  </div>
</template>

<script setup>
import { AlertCircle } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  title: String,
  message: String,
  showRetry: {
    type: Boolean,
    default: true
  }
})

defineEmits(['retry'])
</script>
