import { parseLocalDate } from './dateRanges'

const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
})

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount)
}

const compactCurrencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function formatCompactCurrency(amount: number): string {
  return compactCurrencyFormatter.format(amount)
}

export function formatDate(isoDate: string): string {
  const date = parseLocalDate(isoDate)
  if (Number.isNaN(date.getTime())) return isoDate
  return new Intl.DateTimeFormat('tr-TR').format(date)
}
