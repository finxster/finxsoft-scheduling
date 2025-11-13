<template>
  <div class="bg-white rounded-card shadow-card p-6">
    <div class="grid grid-cols-7 gap-2">
      <!-- Weekday headers -->
      <div 
        v-for="day in weekDays" 
        :key="day"
        class="text-center text-sm font-semibold text-gray-600 py-2"
      >
        {{ day }}
      </div>
      
      <!-- Calendar days -->
      <button
        v-for="day in calendarDays"
        :key="day.date"
        :disabled="!day.hasSlots"
        :class="getDayClasses(day)"
        class="aspect-square rounded-lg p-2 text-sm transition-colors relative"
        @click="selectDay(day)"
      >
        <span>{{ day.dayNumber }}</span>
        <span 
          v-if="day.appointmentCount > 0"
          class="absolute bottom-1 right-1 w-2 h-2 bg-teal rounded-full"
        ></span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns'

const props = defineProps({
  month: {
    type: Date,
    required: true
  },
  appointments: {
    type: Array,
    default: () => []
  },
  availability: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['day-selected'])

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const calendarDays = computed(() => {
  const start = startOfMonth(props.month)
  const end = endOfMonth(props.month)
  const days = eachDayOfInterval({ start, end })
  
  // Add padding for first day of month
  const firstDayOfWeek = getDay(start)
  const padding = Array(firstDayOfWeek).fill(null)
  
  return [
    ...padding.map(() => ({ empty: true })),
    ...days.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd')
      const dayAppointments = props.appointments.filter(apt => 
        format(new Date(apt.scheduledAt), 'yyyy-MM-dd') === dateStr
      )
      
      return {
        date: dateStr,
        dayNumber: format(date, 'd'),
        hasSlots: props.availability.some(av => av.date === dateStr && av.hasAvailability),
        appointmentCount: dayAppointments.length
      }
    })
  ]
})

function getDayClasses(day) {
  if (day.empty) return 'invisible'
  if (!day.hasSlots) return 'bg-gray-100 text-gray-400 cursor-not-allowed'
  return 'bg-white border-2 border-gray-200 hover:border-teal hover:bg-teal-50 text-gray-900 cursor-pointer'
}

function selectDay(day) {
  if (!day.empty && day.hasSlots) {
    emit('day-selected', day.date)
  }
}
</script>
