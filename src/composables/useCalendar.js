import { useCalendarStore } from '@/stores/calendar'
import { storeToRefs } from 'pinia'

export function useCalendar() {
  const calendarStore = useCalendarStore()
  const { 
    availability, 
    timeBlocks, 
    loading, 
    error,
    selectedDate 
  } = storeToRefs(calendarStore)
  
  return {
    availability,
    timeBlocks,
    loading,
    error,
    selectedDate,
    fetchAvailability: calendarStore.fetchAvailability,
    blockTime: calendarStore.blockTime,
    unblockTime: calendarStore.unblockTime,
    setSelectedDate: calendarStore.setSelectedDate
  }
}
