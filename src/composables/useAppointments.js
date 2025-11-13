import { useAppointmentsStore } from '@/stores/appointments'
import { storeToRefs } from 'pinia'

export function useAppointments() {
  const appointmentsStore = useAppointmentsStore()
  const { appointments, loading, error } = storeToRefs(appointmentsStore)
  
  return {
    appointments,
    loading,
    error,
    fetchAppointments: appointmentsStore.fetchAppointments,
    confirmAppointment: appointmentsStore.confirmAppointment,
    cancelAppointment: appointmentsStore.cancelAppointment,
    completeAppointment: appointmentsStore.completeAppointment,
    getAppointmentById: appointmentsStore.getAppointmentById
  }
}
