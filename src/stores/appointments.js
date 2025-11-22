import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAppointmentsStore = defineStore('appointments', () => {
  const appointments = ref([])
  const stats = ref({
    todayCount: 0,
    pendingCount: 0,
    confirmedCount: 0,
    totalCount: 0
  })
  const loading = ref(false)
  const error = ref(null)
  const currentPage = ref(0)
  const totalPages = ref(0)
  const totalItems = ref(0)

  const upcomingAppointments = computed(() => {
    const now = new Date()
    return appointments.value
      .filter(apt => new Date(apt.scheduledAt) >= now && apt.status !== 'CANCELLED')
      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
      .slice(0, 5)
  })

  async function fetchAppointments(filters = {}) {
    loading.value = true
    error.value = null
    
    try {
      const params = {
        page: filters.page || 0,
        size: filters.size || 20
      }
      
      if (filters.status) {
        params.status = filters.status
      }
      if (filters.startDate) {
        params.startDate = filters.startDate
      }
      
      const response = await api.get('/appointments', { params })
      
      appointments.value = response.data.content
      currentPage.value = response.data.number
      totalPages.value = response.data.totalPages
      totalItems.value = response.data.totalElements
      
      return appointments.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch appointments'
      console.error('Error fetching appointments:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchDashboardStats() {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/appointments/dashboard/stats')
      stats.value = response.data
      return stats.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch stats'
      console.error('Error fetching stats:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getAppointmentById(appointmentId) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/appointments/${appointmentId}`)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch appointment'
      console.error('Error fetching appointment:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function confirmAppointment(appointmentId, notes = '') {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.put(`/appointments/${appointmentId}/confirm`, { notes })
      
      const index = appointments.value.findIndex(a => a.id === appointmentId)
      if (index !== -1) {
        appointments.value[index] = response.data
      }
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to confirm appointment'
      console.error('Error confirming appointment:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function cancelAppointment(appointmentId, reason) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.put(`/appointments/${appointmentId}/cancel`, { reason })
      
      const index = appointments.value.findIndex(a => a.id === appointmentId)
      if (index !== -1) {
        appointments.value[index] = response.data
      }
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to cancel appointment'
      console.error('Error cancelling appointment:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function completeAppointment(appointmentId) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.put(`/appointments/${appointmentId}/complete`)
      
      const index = appointments.value.findIndex(a => a.id === appointmentId)
      if (index !== -1) {
        appointments.value[index] = response.data
      }
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to complete appointment'
      console.error('Error completing appointment:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    appointments,
    stats,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    upcomingAppointments,
    fetchAppointments,
    fetchDashboardStats,
    getAppointmentById,
    confirmAppointment,
    cancelAppointment,
    completeAppointment
  }
})
