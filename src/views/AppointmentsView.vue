<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">{{ t('appointments.title') }}</h2>
    </div>
    
    <AppointmentFilters
      :filters="filters"
      @update:filters="handleFilterChange"
    />
    
    <div class="bg-white rounded-card shadow-card p-6">
      <div v-if="loading" class="py-4">
        <AppointmentsListSkeleton :itemCount="5" />
      </div>
      
      <div v-else-if="appointments.length === 0" class="text-center py-12">
        <EmptyState
          :message="t('appointments.noResults')"
          :description="t('appointments.tryDifferentFilters')"
        />
      </div>
      
      <div v-else>
        <AppointmentList
          :appointments="appointments"
          @confirm="handleConfirm"
          @cancel="showCancelModal"
        />
        
        <div class="mt-6 flex items-center justify-between">
          <p class="text-sm text-gray-600">
            {{ t('appointments.pagination', { 
              from: (currentPage - 1) * pageSize + 1,
              to: Math.min(currentPage * pageSize, totalItems),
              total: totalItems
            }) }}
          </p>
          
          <div class="flex gap-2">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="btn-secondary disabled:opacity-50"
            >
              {{ t('common.previous') }}
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage >= totalPages"
              class="btn-secondary disabled:opacity-50"
            >
              {{ t('common.next') }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <AppModal v-model="cancelModalOpen" :title="t('appointments.cancelAppointment')">
      <div class="space-y-4">
        <p class="text-gray-600">{{ t('appointments.confirmCancel') }}</p>
        
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            {{ t('appointments.cancelReason') }}
          </label>
          <textarea
            v-model="cancelReason"
            rows="4"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            :placeholder="t('appointments.cancelReason')"
          />
        </div>
      </div>
      
      <template #footer>
        <button @click="cancelModalOpen = false" class="btn-secondary">
          {{ t('common.cancel') }}
        </button>
        <button @click="handleCancelConfirm" class="btn-danger">
          {{ t('common.confirm') }}
        </button>
      </template>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppointmentsStore } from '@/stores/appointments'
import AppointmentFilters from '@/components/appointments/AppointmentFilters.vue'
import AppointmentList from '@/components/appointments/AppointmentList.vue'
import AppointmentsListSkeleton from '@/components/common/AppointmentsListSkeleton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import AppModal from '@/components/common/AppModal.vue'

const { t } = useI18n()
const appointmentsStore = useAppointmentsStore()

const filters = ref({
  status: '',
  startDate: '',
  endDate: ''
})

const cancelModalOpen = ref(false)
const cancelReason = ref('')
const appointmentToCancel = ref(null)

const appointments = computed(() => appointmentsStore.appointments)
const loading = computed(() => appointmentsStore.loading)
const currentPage = computed(() => appointmentsStore.currentPage)
const totalPages = computed(() => appointmentsStore.totalPages)
const totalItems = computed(() => appointmentsStore.totalItems)
const pageSize = 10

onMounted(() => {
  loadAppointments()
})

async function loadAppointments() {
  await appointmentsStore.fetchAppointments({
    ...filters.value,
    page: currentPage.value,
    size: pageSize
  })
}

function handleFilterChange(newFilters) {
  filters.value = newFilters
  loadAppointments()
}

async function handleConfirm(appointmentId) {
  await appointmentsStore.confirmAppointment(appointmentId)
  loadAppointments()
}

function showCancelModal(appointmentId) {
  appointmentToCancel.value = appointmentId
  cancelModalOpen.value = true
}

async function handleCancelConfirm() {
  if (appointmentToCancel.value) {
    await appointmentsStore.cancelAppointment(appointmentToCancel.value, cancelReason.value)
    cancelModalOpen.value = false
    cancelReason.value = ''
    appointmentToCancel.value = null
    loadAppointments()
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    appointmentsStore.currentPage--
    loadAppointments()
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    appointmentsStore.currentPage++
    loadAppointments()
  }
}
</script>
