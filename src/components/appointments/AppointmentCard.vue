<template>
  <div class="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 transition-colors">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4 flex-1">
        <img
          :src="clientAvatar"
          :alt="clientName"
          class="w-12 h-12 rounded-full object-cover"
        />
        
        <div class="flex-1">
          <h4 class="font-semibold text-gray-900">{{ clientName }}</h4>
          <div class="flex items-center gap-3 text-sm text-gray-600 mt-1">
            <span class="flex items-center gap-1">
              <Calendar class="w-4 h-4" />
              {{ formattedDate }}
            </span>
            <span class="flex items-center gap-1">
              <Clock class="w-4 h-4" />
              {{ formattedTime }}
            </span>
            <span>{{ appointment.durationMinutes }}min</span>
          </div>
        </div>
      </div>
      
      <div class="flex items-center gap-3">
        <StatusBadge :status="appointment.status" />
        
        <div class="flex items-center gap-2">
          <button
            v-if="appointment.status === 'PENDING'"
            @click="$emit('confirm', appointment.id)"
            class="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
            :title="t('appointments.confirmAppointment')"
          >
            <Check class="w-5 h-5" />
          </button>
          
          <button
            v-if="appointment.status !== 'CANCELLED'"
            @click="$emit('cancel', appointment.id)"
            class="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
            :title="t('appointments.cancelAppointment')"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatDate, formatTime } from '@/utils/dateHelpers'
import { Calendar, Clock, Check, X } from 'lucide-vue-next'
import StatusBadge from './StatusBadge.vue'

const props = defineProps({
  appointment: {
    type: Object,
    required: true
  },
  clientName: {
    type: String,
    default: 'Cliente'
  },
  clientAvatar: {
    type: String,
    default: 'https://ui-avatars.com/api/?name=Client'
  }
})

defineEmits(['confirm', 'cancel'])

const { t, locale } = useI18n()

const formattedDate = computed(() => formatDate(props.appointment.scheduledAt, 'PP', locale.value))
const formattedTime = computed(() => formatTime(props.appointment.scheduledAt, locale.value))
</script>
