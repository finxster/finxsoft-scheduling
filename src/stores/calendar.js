import { defineStore } from 'pinia'
import { ref } from 'vue'
import { startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from 'date-fns'

export const useCalendarStore = defineStore('calendar', () => {
  const currentMonth = ref(new Date())
  const timeBlocks = ref([])
  const loading = ref(false)
  const monthDays = ref([])

  function updateMonthDays() {
    const start = startOfMonth(currentMonth.value)
    const end = endOfMonth(currentMonth.value)
    monthDays.value = eachDayOfInterval({ start, end })
  }

  function nextMonth() {
    currentMonth.value = addMonths(currentMonth.value, 1)
    updateMonthDays()
  }

  function prevMonth() {
    currentMonth.value = subMonths(currentMonth.value, 1)
    updateMonthDays()
  }

  function goToToday() {
    currentMonth.value = new Date()
    updateMonthDays()
  }

  async function fetchTimeBlocks() {
    loading.value = true
    
    return new Promise((resolve) => {
      setTimeout(() => {
        timeBlocks.value = [
          {
            id: 'block-1',
            startDate: new Date(2025, 10, 20).toISOString(),
            endDate: new Date(2025, 10, 27).toISOString(),
            reason: 'Férias',
            recurring: false
          }
        ]
        loading.value = false
        resolve(timeBlocks.value)
      }, 500)
    })
  }

  async function createTimeBlock(blockData) {
    loading.value = true
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const newBlock = {
          id: `block-${Date.now()}`,
          ...blockData
        }
        timeBlocks.value.push(newBlock)
        loading.value = false
        resolve(newBlock)
      }, 300)
    })
  }

  async function deleteTimeBlock(blockId) {
    loading.value = true
    
    return new Promise((resolve) => {
      setTimeout(() => {
        timeBlocks.value = timeBlocks.value.filter(b => b.id !== blockId)
        loading.value = false
        resolve(true)
      }, 300)
    })
  }

  updateMonthDays()

  return {
    currentMonth,
    monthDays,
    timeBlocks,
    loading,
    nextMonth,
    prevMonth,
    goToToday,
    fetchTimeBlocks,
    createTimeBlock,
    deleteTimeBlock
  }
})
