<template>
  <div class="bg-white rounded-card shadow-card p-6">
    <h3 class="text-lg font-semibold text-navy mb-4">
      {{ formattedDate }}
    </h3>
    
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-teal"></div>
    </div>
    
    <div v-else-if="dayAppointments.length === 0" class="text-center py-8 text-gray-500">
      Nenhum agendamento para este dia
    </div>
    
    <div v-else class="space-y-3">
      <div
        v-for="appointment in dayAppointments"
        :key="appointment.id"
        class="border-l-4 border-teal bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
        @click="$emit('appointment-click', appointment)"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium text-gray-900">
              {{ formatTime(appointment.scheduledAt) }}
            </p>
            <p class="text-sm text-gray-600 mt-1">
              {{ appointment.client.name || 'Cliente' }}
            </p>
          </div>
          <span :class="getStatusBadgeClass(appointment.status)" class="px-2 py-1 text-xs rounded-full">
            {{ getStatusLabel(appointment.status) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const props = defineProps({
  date: {
    type: String,
    required: true
  },
  appointments: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['appointment-click'])

const formattedDate = computed(() => {
  return format(new Date(props.date), "d 'de' MMMM", { locale: ptBR })
})

const dayAppointments = computed(() => {
  return props.appointments
    .filter(apt => format(new Date(apt.scheduledAt), 'yyyy-MM-dd') === props.date)
    .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
})

function formatTime(datetime) {
  return format(new Date(datetime), 'HH:mm')
}

function getStatusLabel(status) {
  const labels = {
    PENDING: 'Pendente',
    CONFIRMED: 'Confirmado',
    CANCELLED: 'Cancelado',
    COMPLETED: 'Concluído'
  }
  return labels[status] || status
}

function getStatusBadgeClass(status) {
  const classes = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-teal-100 text-teal-800',
    CANCELLED: 'bg-coral-100 text-coral-800',
    COMPLETED: 'bg-sky-100 text-sky-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}
</script>
