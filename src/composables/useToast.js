import { ref } from 'vue'

const toasts = ref([])
let nextId = 0

export function useToast() {
  function showToast(message, type = 'success', duration = 3000) {
    const id = nextId++
    const toast = { id, message, type }
    
    toasts.value.push(toast)
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    
    return id
  }
  
  function removeToast(id) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  function success(message) {
    return showToast(message, 'success')
  }
  
  function error(message) {
    return showToast(message, 'error', 5000)
  }
  
  function warning(message) {
    return showToast(message, 'warning', 4000)
  }
  
  function info(message) {
    return showToast(message, 'info')
  }
  
  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}
