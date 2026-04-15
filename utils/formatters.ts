import { format, parseISO, isToday, isTomorrow, isYesterday } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function formatDate(dateString: string | Date, formatStr: string = 'dd/MM/yyyy'): string {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString
    return format(date, formatStr, { locale: ptBR })
  } catch {
    return '--/--/----'
  }
}

export function formatDateTime(dateString: string | Date): string {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  } catch {
    return '--/--/---- --:--'
  }
}

export function formatRelativeDate(dateString: string | Date): string {
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString
    
    if (isToday(date)) {
      return `Hoje, ${format(date, 'HH:mm', { locale: ptBR })}`
    }
    if (isTomorrow(date)) {
      return `Amanhã, ${format(date, 'HH:mm', { locale: ptBR })}`
    }
    if (isYesterday(date)) {
      return `Ontem, ${format(date, 'HH:mm', { locale: ptBR })}`
    }
    
    return format(date, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })
  } catch {
    return '--/--/----'
  }
}

export function formatCurrency(value: number, currency: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(value)
}

export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value >= 0 ? '+' : ''}${formatNumber(value, decimals)}%`
}

export function formatOdds(value: number): string {
  return value.toFixed(2)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function getInitials(name: string): string {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
