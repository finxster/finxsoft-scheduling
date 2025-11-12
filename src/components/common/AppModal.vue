<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-screen items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50 transition-opacity" @click="close"></div>
          
          <div class="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all">
            <button
              v-if="showClose"
              @click="close"
              class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X class="w-5 h-5" />
            </button>
            
            <div v-if="title" class="mb-4">
              <h3 class="text-xl font-bold text-gray-900">{{ title }}</h3>
            </div>
            
            <div class="mb-6">
              <slot />
            </div>
            
            <div v-if="$slots.footer" class="flex justify-end gap-3">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { X } from 'lucide-vue-next'

const props = defineProps({
  modelValue: Boolean,
  title: String,
  showClose: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'close'])

function close() {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
