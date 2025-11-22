<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
    <div class="w-full max-w-2xl">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <img :src="whiteLabel.brand.logo" :alt="whiteLabel.brand.name" class="w-20 h-20 mx-auto mb-4" />
          <h1 class="text-3xl font-bold text-gray-900">{{ t('onboarding.welcome') }} {{ whiteLabel.brand.shortName }}</h1>
          <p class="text-gray-600 mt-2">{{ t('onboarding.letsStart') }}</p>
        </div>
        
        <div class="mb-8">
          <div class="flex justify-between">
            <div v-for="i in 4" :key="i" class="flex-1">
              <div :class="['h-2 rounded-full transition-all', i <= currentStep ? 'bg-blue-500' : 'bg-gray-200']"></div>
            </div>
          </div>
          <p class="text-center text-sm text-gray-600 mt-2">{{ t('common.step') }} {{ currentStep }} / 4</p>
        </div>
        
        <div v-if="currentStep === 1" class="space-y-6">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ t('onboarding.step1Title') }}</h2>
            <p class="text-gray-600">{{ t('onboarding.step1Subtitle') }}</p>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <label
              v-for="day in weekDays"
              :key="day.value"
              class="flex items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all"
              :class="[onboardingData.workDays.includes(day.value) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300']"
            >
              <input v-model="onboardingData.workDays" type="checkbox" :value="day.value" class="w-5 h-5 text-blue-600 rounded" />
              <span class="font-medium">{{ day.labelPt }}</span>
            </label>
          </div>
        </div>
        
        <div v-if="currentStep === 2" class="space-y-6">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ t('onboarding.step2Title') }}</h2>
            <p class="text-gray-600">{{ t('onboarding.step2Subtitle') }}</p>
          </div>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">{{ t('settings.startTime') }}</label>
              <input v-model="onboardingData.workStart" type="time" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg" />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">{{ t('settings.endTime') }}</label>
              <input v-model="onboardingData.workEnd" type="time" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg" />
            </div>
          </div>
        </div>
        
        <div v-if="currentStep === 3" class="space-y-6">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ t('onboarding.step3Title') }}</h2>
            <p class="text-gray-600">{{ t('onboarding.step3Subtitle') }}</p>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label
              v-for="duration in slotDurations"
              :key="duration.value"
              class="flex flex-col items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition-all"
              :class="[onboardingData.slotDurationMinutes === duration.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300']"
            >
              <input v-model="onboardingData.slotDurationMinutes" type="radio" :value="duration.value" class="sr-only" />
              <span class="text-2xl font-bold">{{ duration.value }}</span>
              <span class="text-sm text-gray-600">{{ t('settings.minutes') }}</span>
            </label>
          </div>
        </div>
        
        <div v-if="currentStep === 4" class="space-y-6">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ t('onboarding.step4Title') }}</h2>
            <p class="text-gray-600 mb-6">{{ t('onboarding.step4Subtitle') }}</p>
            
            <div class="bg-blue-50 rounded-xl p-6 space-y-4 text-left">
              <div class="flex items-center gap-3">
                <CalendarDays class="w-6 h-6 text-blue-500" />
                <div>
                  <p class="font-semibold text-gray-900">{{ t('settings.workDays') }}</p>
                  <p class="text-sm text-gray-600">{{ onboardingData.workDays.map(d => weekDays.find(wd => wd.value === d)?.labelPt).join(', ') }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <Clock class="w-6 h-6 text-blue-500" />
                <div>
                  <p class="font-semibold text-gray-900">{{ t('settings.workHours') }}</p>
                  <p class="text-sm text-gray-600">{{ onboardingData.workStart }} - {{ onboardingData.workEnd }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <Timer class="w-6 h-6 text-blue-500" />
                <div>
                  <p class="font-semibold text-gray-900">{{ t('settings.slotDuration') }}</p>
                  <p class="text-sm text-gray-600">{{ onboardingData.slotDurationMinutes }} {{ t('settings.minutes') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-between mt-8">
          <button v-if="currentStep > 1" @click="prevStep" class="btn-secondary">{{ t('common.back') }}</button>
          <div v-else></div>
          
          <button v-if="currentStep < 4" @click="nextStep" :disabled="!canProceed" class="btn-primary disabled:opacity-50">
            {{ t('common.next') }}
          </button>
          
          <button v-else @click="completeOnboarding" class="btn-primary">{{ t('common.finish') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProfessionalStore } from '@/stores/professional'
import { WEEK_DAYS, SLOT_DURATIONS } from '@/utils/constants'
import whiteLabel from '@/config/whiteLabel'
import { Clock, CalendarDays, Timer } from 'lucide-vue-next'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const professionalStore = useProfessionalStore()

const currentStep = ref(1)
const onboardingData = ref({
  workDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
  workStart: '09:00:00',
  workEnd: '18:00:00',
  slotDurationMinutes: 60,
  slug: '',
  displayName: '',
  email: '',
  specialty: '',
  bio: '',
  brandName: '',
  publicBookingEnabled: true
})

const weekDays = WEEK_DAYS
const slotDurations = SLOT_DURATIONS

const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1: return onboardingData.value.workDays.length > 0
    case 2: return onboardingData.value.workStart && onboardingData.value.workEnd
    case 3: return onboardingData.value.slotDurationMinutes > 0
    default: return true
  }
})

function nextStep() {
  if (canProceed.value && currentStep.value < 4) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

async function completeOnboarding() {
  try {
    // Get user info from auth store
    const user = authStore.user
    
    // Prepare onboarding data with all required fields
    const data = {
      ...onboardingData.value,
      slug: user.externalId || user.userId, // Use externalId or userId as slug
      email: user.email,
      displayName: onboardingData.value.displayName || user.email.split('@')[0],
      tenantId: 'atipicali' // Default tenant
    }
    
    await professionalStore.onboardProfessional(data)
    authStore.completeOnboarding()
    router.push('/dashboard')
  } catch (error) {
    console.error('Onboarding error:', error)
    alert(t('onboarding.error'))
  }
}
</script>
