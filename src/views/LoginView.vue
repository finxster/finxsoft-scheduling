<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-card p-8">
        <div class="text-center mb-8">
          <img :src="whiteLabel.brand.logo" :alt="whiteLabel.brand.name" class="w-20 h-20 mx-auto mb-4" />
          <h1 class="text-2xl font-bold text-gray-900">{{ whiteLabel.brand.name }}</h1>
          <p class="text-gray-600 mt-2">{{ t('auth.welcome') }}</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              {{ t('auth.email') }}
            </label>
            <input
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :placeholder="t('auth.email')"
            />
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              {{ t('auth.password') }}
            </label>
            <input
              v-model="password"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :placeholder="t('auth.password')"
            />
          </div>
          
          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>
          
          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary py-3 disabled:opacity-50"
          >
            {{ loading ? t('common.loading') : t('auth.login') }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import whiteLabel from '@/config/whiteLabel'
import axios from 'axios'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  loading.value = true
  error.value = ''
  
  try {
    const response = await axios.post(`${import.meta.env.VITE_ATIPICALI_URL}/auth/login`, {
      email: email.value,
      password: password.value
    })
    
    const token = response.data.token || response.data.accessToken
    authStore.setToken(token)
    
    if (authStore.needsOnboarding) {
      router.push('/onboarding')
    } else {
      router.push('/dashboard')
    }
  } catch (err) {
    console.error('Login error:', err)
    error.value = err.response?.data?.message || t('auth.loginError')
  } finally {
    loading.value = false
  }
}
</script>
