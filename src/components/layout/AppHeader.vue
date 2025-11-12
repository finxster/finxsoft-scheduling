<template>
  <header class="bg-white border-b border-gray-200 px-6 py-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h2>
      </div>
      
      <div class="flex items-center gap-4">
        <button
          @click="toggleLocale"
          class="px-3 py-2 rounded-lg hover:bg-gray-100 text-sm font-medium text-gray-700 transition-colors"
        >
          {{ currentLocale === 'pt-BR' ? '🇧🇷 PT' : '🇺🇸 EN' }}
        </button>
        
        <div class="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div class="text-right">
            <p class="text-sm font-semibold text-gray-900">{{ professional?.displayName || 'Professional' }}</p>
            <p class="text-xs text-gray-500">{{ professional?.email }}</p>
          </div>
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {{ initials }}
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useProfessionalStore } from '@/stores/professional'

const { t, locale } = useI18n()
const route = useRoute()
const professionalStore = useProfessionalStore()

const professional = computed(() => professionalStore.profile)
const currentLocale = computed(() => locale.value)

const pageTitle = computed(() => {
  const titleKey = `${route.name}.title`
  return t(titleKey)
})

const initials = computed(() => {
  if (!professional.value?.displayName) return 'PR'
  const names = professional.value.displayName.split(' ')
  return names.map(n => n[0]).slice(0, 2).join('').toUpperCase()
})

function toggleLocale() {
  locale.value = locale.value === 'pt-BR' ? 'en-US' : 'pt-BR'
}
</script>
