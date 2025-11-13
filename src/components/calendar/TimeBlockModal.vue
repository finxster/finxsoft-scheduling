<template>
  <AppModal :is-open="isOpen" @close="$emit('close')">
    <template #header>
      <h3 class="text-xl font-semibold text-navy">Bloquear Horário</h3>
    </template>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <AppInput
        v-model="form.startDate"
        type="date"
        label="Data Início"
        required
      />
      
      <AppInput
        v-model="form.endDate"
        type="date"
        label="Data Fim"
        required
      />
      
      <AppInput
        v-model="form.reason"
        label="Motivo"
        placeholder="Ex: Férias, Reunião..."
        required
      />
      
      <div class="flex items-center gap-2">
        <input
          v-model="form.recurring"
          type="checkbox"
          id="recurring"
          class="w-4 h-4 text-teal rounded"
        />
        <label for="recurring" class="text-sm font-medium text-gray-700">
          Repetir semanalmente
        </label>
      </div>
    </form>
    
    <template #footer>
      <div class="flex gap-3 justify-end">
        <AppButton variant="secondary" @click="$emit('close')">
          Cancelar
        </AppButton>
        <AppButton @click="handleSubmit" :loading="loading">
          Bloquear
        </AppButton>
      </div>
    </template>
  </AppModal>
</template>

<script setup>
import { ref, reactive } from 'vue'
import AppModal from '@/components/common/AppModal.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'submit'])

const loading = ref(false)
const form = reactive({
  startDate: '',
  endDate: '',
  reason: '',
  recurring: false
})

async function handleSubmit() {
  loading.value = true
  try {
    await emit('submit', { ...form })
    Object.assign(form, {
      startDate: '',
      endDate: '',
      reason: '',
      recurring: false
    })
  } finally {
    loading.value = false
  }
}
</script>
