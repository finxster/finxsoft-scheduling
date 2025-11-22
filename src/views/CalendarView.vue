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
          <div class="flex flex-col h-full">
            <span class="text-sm font-medium">{{ day ? format(day, 'd') : '' }}</span>
            <div v-if="day && isBlockedDay(day)" class="mt-1 text-xs bg-red-100 text-red-700 px-1 py-0.5 rounded">
              {{ t('calendar.blocked') }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Time Blocks List -->
    <div v-if="calendarStore.timeBlocks.length > 0" class="bg-white rounded-card shadow-card p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ t('calendar.blockedPeriods') }}</h3>
      <div class="space-y-3">
        <div
          v-for="block in calendarStore.timeBlocks"
          :key="block.id"
          class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <div class="flex-1">
            <p class="font-medium text-gray-900">{{ block.reason }}</p>
            <p class="text-sm text-gray-600">
              {{ formatDate(new Date(block.startTime), 'PP', locale) }} - 
              {{ formatDate(new Date(block.endTime), 'PP', locale) }}
            </p>
          </div>
          <button
            @click="deleteBlock(block.id)"
            class="text-red-600 hover:text-red-700 p-2"
            :title="t('common.delete')"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
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
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isWithinInterval, parseISO } from 'date-fns'
import { ptBR, enUS } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useCalendarStore } from '@/stores/calendar'
import { useToast } from '@/composables/useToast'
import { formatDate } from '@/utils/dateHelpers'
import AppModal from '@/components/common/AppModal.vue'
import AppInput from '@/components/common/AppInput.vue'

const { t, locale } = useI18n()
const toast = useToast()
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
  try {
    await calendarStore.fetchTimeBlocks()
  } catch (error) {
    toast.error(error.response?.data?.message || t('common.errorMessage'))
  }
})

function isBlockedDay(day) {
  return calendarStore.timeBlocks.some(block => {
    const start = parseISO(block.startTime)
    const end = parseISO(block.endTime)
    return isWithinInterval(day, { start, end })
  })
}

function getDayClasses(day) {
  if (!day) return 'p-2 min-h-[80px]'
  
  const isBlocked = isBlockedDay(day)
  
  return [
    'p-2 min-h-[80px] border rounded-lg cursor-pointer transition-colors',
    isBlocked 
      ? 'border-red-300 bg-red-50 hover:bg-red-100' 
      : 'border-gray-200 hover:bg-blue-50'
  ]
}

function selectDay(day) {
  if (day) {
    selectedDay.value = day
  }
}

async function handleBlockTime() {
  try {
    await calendarStore.createTimeBlock({
      startTime: new Date(blockForm.value.startDate).toISOString(),
      endTime: new Date(blockForm.value.endDate).toISOString(),
      reason: blockForm.value.reason,
      recurring: blockForm.value.recurring
    })
    
    toast.success(t('calendar.timeBlocked'))
    blockTimeModalOpen.value = false
    blockForm.value = {
      startDate: '',
      endDate: '',
      reason: '',
      recurring: false
    }
  } catch (error) {
    toast.error(error.response?.data?.message || t('calendar.blockError'))
  }
}

async function deleteBlock(blockId) {
  try {
    await calendarStore.deleteTimeBlock(blockId)
    toast.success(t('calendar.timeUnblocked'))
  } catch (error) {
    toast.error(error.response?.data?.message || t('calendar.deleteError'))
  }
}
</script>
