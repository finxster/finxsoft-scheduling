import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

export function useAuth() {
  const authStore = useAuthStore()
  const { token, user, isAuthenticated } = storeToRefs(authStore)
  
  return {
    token,
    user,
    isAuthenticated,
    login: authStore.login,
    logout: authStore.logout,
    setToken: authStore.setToken,
    refreshToken: authStore.refreshToken
  }
}
