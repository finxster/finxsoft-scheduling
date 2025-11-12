<template>
  <div class="bg-white rounded-card shadow-card p-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          {{ t('appointments.status') }}
        </label>
        <select
          v-model="localFilters.status"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          @change="emitFilters"
        >
          <option value="">{{ t('common.all') }}</option>
          <option value="PENDING">{{ t('appointments.statuses.PENDING') }}</option>
          <option value="CONFIRMED">{{ t('appointments.statuses.CONFIRMED') }}</option>
          <option value="CANCELLED">{{ t('appointments.statuses.CANCELLED') }}</option>
          <option value="COMPLETED">{{ t('appointments.statuses.COMPLETED') }}</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          {{ t('appointments.startDate') }}
        </label>
        <input
          v-model="localFilters.startDate"
          type="date"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          @change="emitFilters"
        />
      </div>
      
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          {{ t('appointments.endDate') }}
        </label>
        <input
          v-model="localFilters.endDate"
          type="date"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          @change="emitFilters"
        />
      </div>
      
      <div class="flex items-end">
        <button
          @click="clearFilters"
          class="w-full btn-secondary"
        >
          {{ t('common.clear') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:filters'])

const { t } = useI18n()

const localFilters = ref({
  status: props.filters.status || '',
  startDate: props.filters.startDate || '',
  endDate: props.filters.endDate || ''
})

function emitFilters() {
  emit('update:filters', { ...localFilters.value })
}

function clearFilters() {
  localFilters.value = {
    status: '',
    startDate: '',
    endDate: ''
  }
  emitFilters()
}
</script>
