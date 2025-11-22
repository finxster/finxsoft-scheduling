<template>
  <div class="space-y-6">
    <!-- Error State for Profile Loading -->
    <div v-if="profileError" class="bg-white rounded-card shadow-card p-6">
      <ErrorState 
        :message="profileError"
        @retry="loadProfile"
      />
    </div>
    
    <div v-else>
      <h3 class="text-xl font-semibold text-gray-900">
        {{ t('dashboard.greeting') }}, {{ professional?.displayName || 'Professional' }}!
      </h3>
      <p class="text-gray-600">{{ formatDate(new Date(), 'PPPP', locale) }}</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-card shadow-card p-6 border-l-4 border-blue-500">
        <div class="flex items-center justify-between mb-2">
          <Calendar class="w-8 h-8 text-blue-500" />
        </div>
        <h4 class="text-3xl font-bold text-gray-900">{{ stats.todayCount }}</h4>
        <p class="text-gray-600 text-sm">{{ t('dashboard.todayAppointments') }}</p>
      </div>
      
      <div class="bg-white rounded-card shadow-card p-6 border-l-4 border-yellow-500">
        <div class="flex items-center justify-between mb-2">
          <Clock class="w-8 h-8 text-yellow-500" />
        </div>
        <h4 class="text-3xl font-bold text-gray-900">{{ stats.pendingCount }}</h4>
        <p class="text-gray-600 text-sm">{{ t('dashboard.pendingConfirmation') }}</p>
      </div>
      
      <div class="bg-white rounded-card shadow-card p-6 border-l-4 border-green-500">
        <div class="flex items-center justify-between mb-2">
          <TrendingUp class="w-8 h-8 text-green-500" />
        </div>
        <h4 class="text-3xl font-bold text-gray-900">{{ stats.confirmedCount }}</h4>
        <p class="text-gray-600 text-sm">{{ t('dashboard.confirmedAppointments') }}</p>
      </div>
      
      <div class="bg-white rounded-card shadow-card p-6 border-l-4 border-purple-500">
        <div class="flex items-center justify-between mb-2">
          <Users class="w-8 h-8 text-purple-500" />
        </div>
        <h4 class="text-3xl font-bold text-gray-900">{{ stats.totalCount }}</h4>
        <p class="text-gray-600 text-sm">{{ t('dashboard.totalAppointments') }}</p>
      </div>
    </div>
    
    <div class="bg-white rounded-card shadow-card p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ t('dashboard.upcomingAppointments') }}</h3>
      
      <DashboardSkeleton v-if="loading" />
      
      <ErrorState 
        v-else-if="appointmentsError"
        :message="appointmentsError"
        @retry="loadAppointments"
      />
      
      <EmptyState v-else-if="upcomingAppointments.length === 0" :message="t('dashboard.noAppointments')" />
      
      <AppointmentList
        v-else
        :appointments="upcomingAppointments"
        @confirm="confirmAppointment"
        @cancel="cancelAppointment"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppointmentsStore } from '@/stores/appointments'
import { useProfessionalStore } from '@/stores/professional'
import { useToast } from '@/composables/useToast'
import { formatDate } from '@/utils/dateHelpers'
import { Calendar, Clock, TrendingUp, Users } from 'lucide-vue-next'
import DashboardSkeleton from '@/components/common/DashboardSkeleton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import AppointmentList from '@/components/appointments/AppointmentList.vue'

const { t, locale } = useI18n()
const toast = useToast()
const appointmentsStore = useAppointmentsStore()
const professionalStore = useProfessionalStore()

const profileError = ref('')
const appointmentsError = ref('')

const stats = computed(() => appointmentsStore.stats)
const upcomingAppointments = computed(() => appointmentsStore.upcomingAppointments)
const loading = computed(() => appointmentsStore.loading)
const professional = computed(() => professionalStore.profile)

onMounted(async () => {
  await loadProfile()
  await loadAppointments()
})

async function loadProfile() {
  profileError.value = ''
  try {
    await professionalStore.fetchProfile()
  } catch (error) {
    profileError.value = error.response?.data?.message || t('common.errorMessage')
  }
}

async function loadAppointments() {
  appointmentsError.value = ''
  try {
    await Promise.all([
      appointmentsStore.fetchDashboardStats(),
      appointmentsStore.fetchAppointments()
    ])
  } catch (error) {
    appointmentsError.value = error.response?.data?.message || t('common.errorMessage')
  }
}

async function confirmAppointment(id) {
  try {
    await appointmentsStore.confirmAppointment(id)
    toast.success(t('appointments.confirmed'))
    await loadAppointments()
  } catch (error) {
    toast.error(error.response?.data?.message || t('appointments.confirmError'))
  }
}

async function cancelAppointment(id) {
  try {
    await appointmentsStore.cancelAppointment(id, 'Cancelled from dashboard')
    toast.success(t('appointments.cancelled'))
    await loadAppointments()
  } catch (error) {
    toast.error(error.response?.data?.message || t('appointments.cancelError'))
  }
}
</script>
