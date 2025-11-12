<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold text-gray-900">{{ t('settings.title') }}</h2>
    
    <div class="bg-white rounded-card shadow-card">
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
              v-model="settingsForm.startTime"
              type="time"
              :label="t('settings.startTime')"
            />
            <AppInput
              v-model="settingsForm.endTime"
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
                settingsForm.slotDuration === duration.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              ]"
            >
              <input
                v-model="settingsForm.slotDuration"
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
import { WEEK_DAYS, SLOT_DURATIONS } from '@/utils/constants'
import AppInput from '@/components/common/AppInput.vue'

const { t } = useI18n()
const professionalStore = useProfessionalStore()

const activeTab = ref('workHours')

const tabs = [
  { id: 'workHours', label: 'settings.workHours' },
  { id: 'slotDuration', label: 'settings.slotDuration' },
  { id: 'profile', label: 'settings.profile' }
]

const settingsForm = ref({
  workDays: [],
  startTime: '09:00',
  endTime: '18:00',
  slotDuration: 60,
  displayName: '',
  email: ''
})

const weekDays = WEEK_DAYS
const slotDurations = SLOT_DURATIONS

onMounted(async () => {
  await professionalStore.fetchProfile()
  settingsForm.value = {
    ...professionalStore.settings,
    displayName: professionalStore.profile?.displayName || '',
    email: professionalStore.profile?.email || ''
  }
})

async function saveSettings() {
  await professionalStore.updateSettings(settingsForm.value)
  alert(t('settings.changesSaved'))
}
</script>
