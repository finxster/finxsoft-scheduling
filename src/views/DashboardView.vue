<template>
  <div class="space-y-6">
    <div>
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
        <h4 class="text-3xl font-bold text-gray-900">{{ stats.today }}</h4>
        <p class="text-gray-600 text-sm">{{ t('dashboard.todayAppointments') }}</p>
      </div>
      
      <div class="bg-white rounded-card shadow-card p-6 border-l-4 border-yellow-500">
        <div class="flex items-center justify-between mb-2">
          <Clock class="w-8 h-8 text-yellow-500" />
        </div>
        <h4 class="text-3xl font-bold text-gray-900">{{ stats.pending }}</h4>
        <p class="text-gray-600 text-sm">{{ t('dashboard.pendingConfirmation') }}</p>
      </div>
      
      <div class="bg-white rounded-card shadow-card p-6 border-l-4 border-green-500">
        <div class="flex items-center justify-between mb-2">
          <TrendingUp class="w-8 h-8 text-green-500" />
        </div>
        <h4 class="text-3xl font-bold text-gray-900">{{ stats.weekTotal }}</h4>
        <p class="text-gray-600 text-sm">{{ t('dashboard.weekTotal') }}</p>
      </div>
      
      <div class="bg-white rounded-card shadow-card p-6 border-l-4 border-red-500">
        <div class="flex items-center justify-between mb-2">
          <Users class="w-8 h-8 text-red-500" />
        </div>
        <h4 class="text-3xl font-bold text-gray-900">{{ stats.attendanceRate }}%</h4>
        <p class="text-gray-600 text-sm">{{ t('dashboard.attendanceRate') }}</p>
      </div>
    </div>
    
    <div class="bg-white rounded-card shadow-card p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ t('dashboard.upcomingAppointments') }}</h3>
      
      <DashboardSkeleton v-if="loading" />
      
      <div v-else-if="upcomingAppointments.length === 0" class="text-center py-8">
        <EmptyState :message="t('dashboard.noAppointments')" />
      </div>
      
      <div v-else>
        <AppointmentList
          :appointments="upcomingAppointments"
          @confirm="confirmAppointment"
          @cancel="cancelAppointment"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppointmentsStore } from '@/stores/appointments'
import { useProfessionalStore } from '@/stores/professional'
import { formatDate } from '@/utils/dateHelpers'
import { Calendar, Clock, TrendingUp, Users } from 'lucide-vue-next'
import DashboardSkeleton from '@/components/common/DashboardSkeleton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import AppointmentList from '@/components/appointments/AppointmentList.vue'

const { t, locale } = useI18n()
const appointmentsStore = useAppointmentsStore()
const professionalStore = useProfessionalStore()

const stats = computed(() => appointmentsStore.stats)
const upcomingAppointments = computed(() => appointmentsStore.upcomingAppointments)
const loading = computed(() => appointmentsStore.loading)
const professional = computed(() => professionalStore.profile)

onMounted(async () => {
  await Promise.all([
    appointmentsStore.fetchDashboardStats(),
    appointmentsStore.fetchAppointments(),
    professionalStore.fetchProfile()
  ])
})

async function confirmAppointment(id) {
  await appointmentsStore.confirmAppointment(id)
  await appointmentsStore.fetchAppointments()
}

async function cancelAppointment(id) {
  await appointmentsStore.cancelAppointment(id, 'Cancelled from dashboard')
  await appointmentsStore.fetchAppointments()
}
</script>
