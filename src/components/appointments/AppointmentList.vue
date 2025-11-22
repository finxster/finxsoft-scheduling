<template>
  <div class="space-y-3">
    <AppointmentCard
      v-for="appointment in appointments"
      :key="appointment.id"
      :appointment="appointment"
      :client-name="appointment.clientName || 'Cliente'"
      :client-avatar="getClientAvatar(appointment.clientName)"
      @confirm="$emit('confirm', $event)"
      @cancel="$emit('cancel', $event)"
    />
  </div>
</template>

<script setup>
import AppointmentCard from './AppointmentCard.vue'

const props = defineProps({
  appointments: {
    type: Array,
    required: true
  }
})

defineEmits(['confirm', 'cancel'])

function getClientAvatar(clientName) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(clientName || 'Client')}`
}
</script>
