<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900">{{ t('settings.title') }}</h2>
    
    <div v-if="loading" class="bg-white rounded-card shadow-card p-6">
      <div class="animate-pulse space-y-4">
        <div class="h-10 bg-gray-200 rounded w-1/3"></div>
        <div class="h-32 bg-gray-200 rounded"></div>
      </div>
    </div>
    
    <ErrorState 
      v-else-if="error"
      :message="error"
      @retry="loadProfile"
    />
    
    <div v-else class="bg-white rounded-card shadow-card">
      <div class="border-b border-gray-200">
        <nav class="flex -mb-px">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-6 py-4 text-sm font-semibold border-b-2 transition-colors',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
            ]"
          >
            {{ t(tab.label) }}
          </button>
        </nav>
      </div>
      
      <div class="p-6">
        <div v-if="activeTab === 'workHours'" class="space-y-6">
          <div>
            <h3 class="font-semibold text-gray-900 mb-4">{{ t('settings.workDays') }}</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <label
                v-for="day in weekDays"
                :key="day.value"
                class="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
              >
                <input
                  v-model="settingsForm.workDays"
                  type="checkbox"
                  :value="day.value"
                  class="w-4 h-4 text-blue-600 rounded"
                />
                <span class="text-sm font-medium">{{ day.labelPt }}</span>
              </label>
            </div>
          </div>
          
          <div class="grid md:grid-cols-2 gap-4">
            <AppInput
              v-model="settingsForm.workStart"
              type="time"
              :label="t('settings.startTime')"
            />
            <AppInput
              v-model="settingsForm.workEnd"
              type="time"
              :label="t('settings.endTime')"
            />
          </div>
          
          <button @click="saveSettings" class="btn-primary">
            {{ t('common.save') }}
          </button>
        </div>
        
        <div v-if="activeTab === 'slotDuration'" class="space-y-6">
          <h3 class="font-semibold text-gray-900">{{ t('settings.slotDuration') }}</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <label
              v-for="duration in slotDurations"
              :key="duration.value"
              class="flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all"
              :class="[
                settingsForm.slotDurationMinutes === duration.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              ]"
            >
              <input
                v-model="settingsForm.slotDurationMinutes"
                type="radio"
                :value="duration.value"
                class="sr-only"
              />
              <span class="text-lg font-semibold">{{ duration.label }}</span>
            </label>
          </div>
          
          <button @click="saveSettings" class="btn-primary">
            {{ t('common.save') }}
          </button>
        </div>
        
        <div v-if="activeTab === 'profile'" class="space-y-6">
          <AppInput
            v-model="settingsForm.displayName"
            :label="t('settings.displayName')"
          />
          
          <AppInput
            v-model="settingsForm.email"
            type="email"
            :label="t('auth.email')"
            disabled
          />
          
          <button @click="saveSettings" class="btn-primary">
            {{ t('common.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProfessionalStore } from '@/stores/professional'
import { useToast } from '@/composables/useToast'
import { WEEK_DAYS, SLOT_DURATIONS } from '@/utils/constants'
import AppInput from '@/components/common/AppInput.vue'
import ErrorState from '@/components/common/ErrorState.vue'

const { t } = useI18n()
const toast = useToast()
const professionalStore = useProfessionalStore()

const activeTab = ref('workHours')
const error = ref('')
const loading = computed(() => professionalStore.loading)

const tabs = [
  { id: 'workHours', label: 'settings.workHours' },
  { id: 'slotDuration', label: 'settings.slotDuration' },
  { id: 'profile', label: 'settings.profile' }
]

const settingsForm = ref({
  workDays: [],
  workStart: '09:00:00',
  workEnd: '18:00:00',
  slotDurationMinutes: 60,
  displayName: '',
  email: '',
  specialty: '',
  bio: '',
  brandName: '',
  logoUrl: '',
  primaryColor: '',
  accentColor: '',
  publicBookingEnabled: true
})

const weekDays = WEEK_DAYS
const slotDurations = SLOT_DURATIONS

onMounted(() => {
  loadProfile()
})

async function loadProfile() {
  error.value = ''
  try {
    await professionalStore.fetchProfile()
    const profile = professionalStore.profile
    if (profile) {
      settingsForm.value = {
        workDays: profile.workDays || [],
        workStart: profile.workStart || '09:00:00',
        workEnd: profile.workEnd || '18:00:00',
        slotDurationMinutes: profile.slotDurationMinutes || 60,
        displayName: profile.displayName || '',
        email: profile.email || '',
        specialty: profile.specialty || '',
        bio: profile.bio || '',
        brandName: profile.brandName || '',
        logoUrl: profile.logoUrl || '',
        primaryColor: profile.primaryColor || '',
        accentColor: profile.accentColor || '',
        publicBookingEnabled: profile.publicBookingEnabled !== false
      }
    }
  } catch (err) {
    error.value = err.response?.data?.message || t('common.errorMessage')
  }
}

async function saveSettings() {
  try {
    await professionalStore.updateSettings(settingsForm.value)
    toast.success(t('settings.changesSaved'))
  } catch (err) {
    toast.error(err.response?.data?.message || t('settings.saveError'))
  }
}
</script>
