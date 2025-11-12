import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProfessionalStore = defineStore('professional', () => {
  const profile = ref(null)
  const settings = ref({
    workDays: [1, 2, 3, 4, 5],
    startTime: '09:00',
    endTime: '18:00',
    slotDuration: 60,
    notifications: {
      newAppointment: true,
      cancellation: true,
      dailySummary: true
    }
  })
  const loading = ref(false)
  const error = ref(null)

  async function fetchProfile() {
    loading.value = true
    error.value = null
    
    return new Promise((resolve) => {
      setTimeout(() => {
        profile.value = {
          id: '123',
          displayName: 'Dr. Maria Silva',
          email: 'maria.silva@example.com',
          specialty: 'Psicologia'
        }
        loading.value = false
        resolve(profile.value)
      }, 500)
    })
  }

  async function updateSettings(newSettings) {
    loading.value = true
    error.value = null
    
    return new Promise((resolve) => {
      setTimeout(() => {
        settings.value = { ...settings.value, ...newSettings }
        loading.value = false
        resolve(settings.value)
      }, 500)
    })
  }

  async function onboardProfessional(data) {
    loading.value = true
    error.value = null
    
    return new Promise((resolve) => {
      setTimeout(() => {
        settings.value = {
          ...settings.value,
          workDays: data.workDays,
          startTime: data.startTime,
          endTime: data.endTime,
          slotDuration: data.slotDuration
        }
        loading.value = false
        resolve(settings.value)
      }, 500)
    })
  }

  return {
    profile,
    settings,
    loading,
    error,
    fetchProfile,
    updateSettings,
    onboardProfessional
  }
})
