import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useProfessionalStore = defineStore('professional', () => {
  const profile = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchProfile() {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/professionals/me')
      profile.value = response.data
      return profile.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch profile'
      console.error('Error fetching profile:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getProfileBySlug(slug) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/public/professionals/slug/${slug}`)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch professional'
      console.error('Error fetching professional by slug:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateSettings(settingsData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.put('/professionals/me/settings', settingsData)
      profile.value = response.data
      return profile.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update settings'
      console.error('Error updating settings:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function onboardProfessional(onboardingData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/professionals/onboard', onboardingData)
      profile.value = response.data
      return profile.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to onboard professional'
      console.error('Error onboarding professional:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    profile,
    loading,
    error,
    fetchProfile,
    getProfileBySlug,
    updateSettings,
    onboardProfessional
  }
})
