import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const needsOnboarding = computed(() => user.value?.needsOnboarding || false)

  function setToken(newToken) {
    token.value = newToken
    localStorage.setItem('token', newToken)
    
    try {
      const decoded = jwtDecode(newToken)
      user.value = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        externalId: decoded.externalId,
        needsOnboarding: decoded.needsOnboarding || false
      }
    } catch (error) {
      console.error('Invalid token:', error)
      logout()
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  function completeOnboarding() {
    if (user.value) {
      user.value.needsOnboarding = false
    }
  }

  if (token.value) {
    try {
      const decoded = jwtDecode(token.value)
      user.value = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        externalId: decoded.externalId,
        needsOnboarding: decoded.needsOnboarding || false
      }
    } catch (error) {
      logout()
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    needsOnboarding,
    setToken,
    logout,
    completeOnboarding
  }
})
