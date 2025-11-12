<template>
  <span :class="badgeClasses">
    {{ statusLabel }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { STATUS_COLORS } from '@/utils/constants'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const { t } = useI18n()

const statusLabel = computed(() => t(`appointments.statuses.${props.status}`))

const badgeClasses = computed(() => {
  const colors = STATUS_COLORS[props.status] || STATUS_COLORS.PENDING
  return [
    'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
    colors.bg,
    colors.text
  ]
})
</script>
