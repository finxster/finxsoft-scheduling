import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { addDays, addHours, startOfToday } from 'date-fns'

export const useAppointmentsStore = defineStore('appointments', () => {
  const appointments = ref([])
  const stats = ref({
    today: 0,
    pending: 0,
    weekTotal: 0,
    attendanceRate: 0
  })
  const loading = ref(false)
  const error = ref(null)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const totalItems = ref(0)

  function generateMockAppointments() {
    const mockData = []
    const today = startOfToday()
    const statuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']
    
    for (let i = 0; i < 50; i++) {
      const daysOffset = Math.floor(Math.random() * 30) - 15
      const date = addDays(today, daysOffset)
      const hour = 9 + Math.floor(Math.random() * 8)
      const appointmentDate = addHours(date, hour)
      
      mockData.push({
        id: `apt-${i + 1}`,
        clientExternalId: `client-${Math.floor(Math.random() * 20) + 1}`,
        dateTime: appointmentDate.toISOString(),
        duration: [30, 45, 60, 90][Math.floor(Math.random() * 4)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        notes: 'Consulta de acompanhamento',
        createdAt: new Date().toISOString()
      })
    }
    
    return mockData.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
  }

  const upcomingAppointments = computed(() => {
    const now = new Date()
    return appointments.value
      .filter(apt => new Date(apt.dateTime) >= now && apt.status !== 'CANCELLED')
      .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
      .slice(0, 5)
  })

  async function fetchAppointments(filters = {}) {
    loading.value = true
    error.value = null
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const allData = generateMockAppointments()
        
        let filtered = allData
        if (filters.status) {
          filtered = filtered.filter(apt => apt.status === filters.status)
        }
        if (filters.startDate) {
          filtered = filtered.filter(apt => new Date(apt.dateTime) >= new Date(filters.startDate))
        }
        if (filters.endDate) {
          filtered = filtered.filter(apt => new Date(apt.dateTime) <= new Date(filters.endDate))
        }
        
        const page = filters.page || 1
        const size = filters.size || 10
        const start = (page - 1) * size
        const end = start + size
        
        appointments.value = filtered.slice(start, end)
        currentPage.value = page
        totalPages.value = Math.ceil(filtered.length / size)
        totalItems.value = filtered.length
        
        loading.value = false
        resolve(appointments.value)
      }, 500)
    })
  }

  async function fetchDashboardStats() {
    loading.value = true
    
    return new Promise((resolve) => {
      setTimeout(() => {
        stats.value = {
          today: 5,
          pending: 12,
          weekTotal: 28,
          attendanceRate: 87
        }
        loading.value = false
        resolve(stats.value)
      }, 500)
    })
  }

  async function confirmAppointment(appointmentId) {
    loading.value = true
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const apt = appointments.value.find(a => a.id === appointmentId)
        if (apt) {
          apt.status = 'CONFIRMED'
        }
        loading.value = false
        resolve(apt)
      }, 300)
    })
  }

  async function cancelAppointment(appointmentId, reason) {
    loading.value = true
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const apt = appointments.value.find(a => a.id === appointmentId)
        if (apt) {
          apt.status = 'CANCELLED'
          apt.cancellationReason = reason
        }
        loading.value = false
        resolve(apt)
      }, 300)
    })
  }

  async function completeAppointment(appointmentId) {
    loading.value = true
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const apt = appointments.value.find(a => a.id === appointmentId)
        if (apt) {
          apt.status = 'COMPLETED'
        }
        loading.value = false
        resolve(apt)
      }, 300)
    })
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
    confirmAppointment,
    cancelAppointment,
    completeAppointment
  }
})
