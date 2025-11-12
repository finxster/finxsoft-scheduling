<template>
  <div class="space-y-3">
    <AppointmentCard
      v-for="appointment in appointments"
      :key="appointment.id"
      :appointment="appointment"
      :client-name="getClientName(appointment.clientExternalId)"
      :client-avatar="getClientAvatar(appointment.clientExternalId)"
      @confirm="$emit('confirm', $event)"
      @cancel="$emit('cancel', $event)"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import AppointmentCard from './AppointmentCard.vue'
import { parentPlatformService } from '@/services/parentPlatformService'

const props = defineProps({
  appointments: {
    type: Array,
    required: true
  }
})

defineEmits(['confirm', 'cancel'])

const clientCache = ref(new Map())

watch(() => props.appointments, async (newAppointments) => {
  for (const apt of newAppointments) {
    if (!clientCache.value.has(apt.clientExternalId)) {
      const client = await parentPlatformService.getClientDetails(apt.clientExternalId)
      clientCache.value.set(apt.clientExternalId, client)
    }
  }
}, { immediate: true })

function getClientName(externalId) {
  return clientCache.value.get(externalId)?.name || 'Cliente'
}

function getClientAvatar(externalId) {
  return clientCache.value.get(externalId)?.avatar || `https://ui-avatars.com/api/?name=Client`
}
</script>
