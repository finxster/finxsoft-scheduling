<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">{{ t('calendar.title') }}</h2>
      <button @click="blockTimeModalOpen = true" class="btn-primary">
        {{ t('calendar.blockTime') }}
      </button>
    </div>
    
    <div class="bg-white rounded-card shadow-card p-6">
      <div class="flex items-center justify-between mb-6">
        <button @click="calendarStore.prevMonth" class="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronLeft class="w-6 h-6" />
        </button>
        
        <h3 class="text-xl font-bold text-gray-900">
          {{ monthName }} {{ currentYear }}
        </h3>
        
        <div class="flex items-center gap-2">
          <button @click="calendarStore.goToToday" class="btn-ghost text-sm">
            {{ t('calendar.today') }}
          </button>
          <button @click="calendarStore.nextMonth" class="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronRight class="w-6 h-6" />
          </button>
        </div>
      </div>
      
      <div class="grid grid-cols-7 gap-2">
        <div
          v-for="day in weekDays"
          :key="day"
          class="text-center font-semibold text-gray-700 py-2"
        >
          {{ t(`calendar.days.${day}`) }}
        </div>
        
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          :class="getDayClasses(day)"
          @click="selectDay(day)"
        >
          <span class="text-sm">{{ day ? format(day, 'd') : '' }}</span>
        </div>
      </div>
    </div>
    
    <AppModal v-model="blockTimeModalOpen" :title="t('calendar.blockTime')">
      <div class="space-y-4">
        <AppInput
          v-model="blockForm.startDate"
          type="date"
          :label="t('appointments.startDate')"
          required
        />
        
        <AppInput
          v-model="blockForm.endDate"
          type="date"
          :label="t('appointments.endDate')"
          required
        />
        
        <AppInput
          v-model="blockForm.reason"
          :label="t('calendar.blockReason')"
          required
        />
        
        <div class="flex items-center gap-2">
          <input
            v-model="blockForm.recurring"
            type="checkbox"
            id="recurring"
            class="w-4 h-4 text-blue-600 rounded"
          />
          <label for="recurring" class="text-sm font-medium text-gray-700">
            {{ t('calendar.recurring') }}
          </label>
        </div>
      </div>
      
      <template #footer>
        <button @click="blockTimeModalOpen = false" class="btn-secondary">
          {{ t('common.cancel') }}
        </button>
        <button @click="handleBlockTime" class="btn-primary">
          {{ t('common.save') }}
        </button>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth } from 'date-fns'
import { ptBR, enUS } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useCalendarStore } from '@/stores/calendar'
import AppModal from '@/components/common/AppModal.vue'
import AppInput from '@/components/common/AppInput.vue'

const { t, locale } = useI18n()
const calendarStore = useCalendarStore()

const selectedDay = ref(null)
const blockTimeModalOpen = ref(false)
const blockForm = ref({
  startDate: '',
  endDate: '',
  reason: '',
  recurring: false
})

const dateLocale = computed(() => locale.value === 'pt-BR' ? ptBR : enUS)
const currentYear = computed(() => format(calendarStore.currentMonth, 'yyyy'))
const monthName = computed(() => format(calendarStore.currentMonth, 'MMMM', { locale: dateLocale.value }))
const weekDays = [0, 1, 2, 3, 4, 5, 6]

const calendarDays = computed(() => {
  const monthStart = startOfMonth(calendarStore.currentMonth)
  const monthEnd = endOfMonth(calendarStore.currentMonth)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  
  return days.map(day => isSameMonth(day, calendarStore.currentMonth) ? day : null)
})

onMounted(async () => {
  await calendarStore.fetchTimeBlocks()
})

function getDayClasses(day) {
  if (!day) return 'p-2 min-h-[80px]'
  
  return [
    'p-2 min-h-[80px] border border-gray-200 rounded-lg cursor-pointer transition-colors hover:bg-blue-50'
  ]
}

function selectDay(day) {
  if (day) {
    selectedDay.value = day
  }
}

async function handleBlockTime() {
  await calendarStore.createTimeBlock({
    startDate: new Date(blockForm.value.startDate).toISOString(),
    endDate: new Date(blockForm.value.endDate).toISOString(),
    reason: blockForm.value.reason,
    recurring: blockForm.value.recurring
  })
  
  blockTimeModalOpen.value = false
  blockForm.value = {
    startDate: '',
    endDate: '',
    reason: '',
    recurring: false
  }
}
</script>
