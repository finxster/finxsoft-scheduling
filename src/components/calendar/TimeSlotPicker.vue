<template>
  <div class="bg-white rounded-card shadow-card p-6">
    <h4 class="font-semibold text-navy mb-4">Selecione um horário</h4>
    
    <div class="grid grid-cols-3 gap-2">
      <button
        v-for="slot in slots"
        :key="slot.time"
        :disabled="!slot.available"
        :class="getSlotClasses(slot)"
        class="py-2 px-4 rounded-lg text-sm font-medium transition-colors"
        @click="selectSlot(slot)"
      >
        {{ slot.time }}
      </button>
    </div>
    
    <div v-if="slots.length === 0" class="text-center py-8 text-gray-500">
      Nenhum horário disponível
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  date: {
    type: String,
    required: true
  },
  slots: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['slot-selected'])

function getSlotClasses(slot) {
  if (!slot.available) {
    return 'bg-gray-100 text-gray-400 cursor-not-allowed'
  }
  if (slot.appointmentId) {
    return 'bg-coral-50 text-coral-600 border-2 border-coral-200 cursor-not-allowed'
  }
  return 'bg-teal-50 text-teal-700 hover:bg-teal-100 border-2 border-teal-200 cursor-pointer'
}

function selectSlot(slot) {
  if (slot.available && !slot.appointmentId) {
    emit('slot-selected', { date: props.date, time: slot.time })
  }
}
</script>
