export const APPOINTMENT_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED'
}

export const SLOT_DURATIONS = [
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '60 min' },
  { value: 90, label: '90 min' }
]

export const WEEK_DAYS = [
  { value: 0, label: 'Sunday', labelPt: 'Domingo' },
  { value: 1, label: 'Monday', labelPt: 'Segunda' },
  { value: 2, label: 'Tuesday', labelPt: 'Terça' },
  { value: 3, label: 'Wednesday', labelPt: 'Quarta' },
  { value: 4, label: 'Thursday', labelPt: 'Quinta' },
  { value: 5, label: 'Friday', labelPt: 'Sexta' },
  { value: 6, label: 'Saturday', labelPt: 'Sábado' }
]

export const STATUS_COLORS = {
  PENDING: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-500'
  },
  CONFIRMED: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-500'
  },
  CANCELLED: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-500'
  },
  COMPLETED: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-500'
  }
}
