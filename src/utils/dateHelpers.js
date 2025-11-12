import { format, parseISO } from 'date-fns'
import { ptBR, enUS } from 'date-fns/locale'

export function formatDate(date, formatStr = 'PP', locale = 'pt-BR') {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const localeObj = locale === 'pt-BR' ? ptBR : enUS
  
  return format(dateObj, formatStr, { locale: localeObj })
}

export function formatTime(date, locale = 'pt-BR') {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const formatStr = locale === 'pt-BR' ? 'HH:mm' : 'h:mm a'
  
  return format(dateObj, formatStr)
}

export function formatDateTime(date, locale = 'pt-BR') {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  const localeObj = locale === 'pt-BR' ? ptBR : enUS
  const formatStr = locale === 'pt-BR' ? 'dd/MM/yyyy HH:mm' : 'MM/dd/yyyy h:mm a'
  
  return format(dateObj, formatStr, { locale: localeObj })
}

export function getTimeFromDate(date) {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'HH:mm')
}

export function combineDateAndTime(date, time) {
  const [hours, minutes] = time.split(':')
  const dateObj = new Date(date)
  dateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0)
  return dateObj
}
