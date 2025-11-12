<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-semibold text-gray-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :class="inputClasses"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-sm text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  id: String,
  label: String,
  type: {
    type: String,
    default: 'text'
  },
  modelValue: [String, Number],
  placeholder: String,
  required: Boolean,
  disabled: Boolean,
  error: String,
  hint: String
})

defineEmits(['update:modelValue'])

const inputClasses = computed(() => {
  const base = 'w-full px-4 py-3 border rounded-lg transition-all'
  const states = props.error
    ? 'border-red-300 focus:ring-2 focus:ring-red-500'
    : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
  const disabled = props.disabled ? 'bg-gray-100 cursor-not-allowed' : ''
  
  return [base, states, disabled]
})
</script>
