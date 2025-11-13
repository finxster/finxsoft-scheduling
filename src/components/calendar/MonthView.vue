<template>
  <div class="space-y-4">
    <!-- Month navigation -->
    <div class="flex items-center justify-between">
      <button
        @click="previousMonth"
        class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ChevronLeft class="w-5 h-5" />
      </button>
      
      <h2 class="text-lg font-semibold text-navy">
        {{ monthTitle }}
      </h2>
      
      <button
        @click="nextMonth"
        class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ChevronRight class="w-5 h-5" />
      </button>
    </div>
    
    <!-- Calendar grid -->
    <CalendarGrid
      :month="currentMonth"
      :appointments="appointments"
      :availability="availability"
      @day-selected="$emit('day-selected', $event)"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { format, addMonths, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import CalendarGrid from './CalendarGrid.vue'

defineProps({
  appointments: {
    type: Array,
    default: () => []
  },
  availability: {
    type: Array,
    default: () => []
  }
})

defineEmits(['day-selected'])

const currentMonth = ref(new Date())

const monthTitle = computed(() => {
  return format(currentMonth.value, 'MMMM yyyy', { locale: ptBR })
})

function previousMonth() {
  currentMonth.value = subMonths(currentMonth.value, 1)
}

function nextMonth() {
  currentMonth.value = addMonths(currentMonth.value, 1)
}
</script>
