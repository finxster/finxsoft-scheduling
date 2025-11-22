import { defineStore } from 'pinia'
import { ref } from 'vue'
import { startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from 'date-fns'
import api from '@/services/api'

export const useCalendarStore = defineStore('calendar', () => {
  const currentMonth = ref(new Date())
  const timeBlocks = ref([])
  const availability = ref([])
  const loading = ref(false)
  const error = ref(null)
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

  async function fetchAvailability(professionalId, date, timezone = 'UTC') {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/public/professionals/${professionalId}/availability`, {
        params: { date, timezone }
      })
      availability.value = response.data
      return availability.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch availability'
      console.error('Error fetching availability:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchTimeBlocks() {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/time-blocks')
      timeBlocks.value = response.data
      return timeBlocks.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch time blocks'
      console.error('Error fetching time blocks:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createTimeBlock(blockData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/time-blocks', {
        startTime: blockData.startTime,
        endTime: blockData.endTime,
        reason: blockData.reason,
        recurring: blockData.recurring || false
      })
      
      timeBlocks.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create time block'
      console.error('Error creating time block:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteTimeBlock(blockId) {
    loading.value = true
    error.value = null
    
    try {
      await api.delete(`/time-blocks/${blockId}`)
      timeBlocks.value = timeBlocks.value.filter(b => b.id !== blockId)
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete time block'
      console.error('Error deleting time block:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  updateMonthDays()

  return {
    currentMonth,
    monthDays,
    timeBlocks,
    availability,
    loading,
    error,
    nextMonth,
    prevMonth,
    goToToday,
    fetchAvailability,
    fetchTimeBlocks,
    createTimeBlock,
    deleteTimeBlock
  }
})
