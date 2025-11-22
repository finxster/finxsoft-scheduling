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
      
      <ErrorState 
        v-else-if="error"
        :message="error"
        @retry="loadAppointments"
      />
      
      <EmptyState
        v-else-if="appointments.length === 0"
        :message="t('appointments.noResults')"
        :description="t('appointments.tryDifferentFilters')"
      />
      
      <div v-else>
        <AppointmentList
          :appointments="appointments"
          @confirm="handleConfirm"
          @cancel="showCancelModal"
        />
        
        <div class="mt-6 flex items-center justify-between">
          <p class="text-sm text-gray-600">
            {{ t('appointments.pagination', { 
              from: currentPage * pageSize + 1,
              to: Math.min((currentPage + 1) * pageSize, totalItems),
              total: totalItems
            }) }}
          </p>
          
          <div class="flex gap-2">
            <button
              @click="prevPage"
              :disabled="currentPage === 0"
              class="btn-secondary disabled:opacity-50"
            >
              {{ t('common.previous') }}
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage >= totalPages - 1"
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
import { useToast } from '@/composables/useToast'
import AppointmentFilters from '@/components/appointments/AppointmentFilters.vue'
import AppointmentList from '@/components/appointments/AppointmentList.vue'
import AppointmentsListSkeleton from '@/components/common/AppointmentsListSkeleton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ErrorState from '@/components/common/ErrorState.vue'
import AppModal from '@/components/common/AppModal.vue'

const { t } = useI18n()
const toast = useToast()
const appointmentsStore = useAppointmentsStore()

const filters = ref({
  status: '',
  startDate: '',
  endDate: ''
})

const cancelModalOpen = ref(false)
const cancelReason = ref('')
const appointmentToCancel = ref(null)
const error = ref('')

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
  error.value = ''
  try {
    await appointmentsStore.fetchAppointments({
      ...filters.value,
      page: currentPage.value,
      size: pageSize
    })
  } catch (err) {
    error.value = err.response?.data?.message || t('common.errorMessage')
  }
}

function handleFilterChange(newFilters) {
  filters.value = newFilters
  loadAppointments()
}

async function handleConfirm(appointmentId) {
  try {
    await appointmentsStore.confirmAppointment(appointmentId)
    toast.success(t('appointments.confirmed'))
    loadAppointments()
  } catch (err) {
    toast.error(err.response?.data?.message || t('appointments.confirmError'))
  }
}

function showCancelModal(appointmentId) {
  appointmentToCancel.value = appointmentId
  cancelModalOpen.value = true
}

async function handleCancelConfirm() {
  if (appointmentToCancel.value) {
    try {
      await appointmentsStore.cancelAppointment(appointmentToCancel.value, cancelReason.value)
      toast.success(t('appointments.cancelled'))
      cancelModalOpen.value = false
      cancelReason.value = ''
      appointmentToCancel.value = null
      loadAppointments()
    } catch (err) {
      toast.error(err.response?.data?.message || t('appointments.cancelError'))
    }
  }
}

function prevPage() {
  if (currentPage.value > 0) {
    appointmentsStore.currentPage--
    loadAppointments()
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value - 1) {
    appointmentsStore.currentPage++
    loadAppointments()
  }
}
</script>
