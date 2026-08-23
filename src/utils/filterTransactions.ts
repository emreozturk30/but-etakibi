import type { Transaction } from '../types'
import type { TransactionFilters } from '../types/filters'
import { getMonthRange } from './dateRanges'

function resolveDateRange(filters: TransactionFilters): {
  start?: string
  end?: string
} {
  switch (filters.rangePreset) {
    case 'this-month':
      return getMonthRange(0)
    case 'last-month':
      return getMonthRange(-1)
    case 'custom':
      return { start: filters.customStart || undefined, end: filters.customEnd || undefined }
    default:
      return {}
  }
}

export function filterTransactions(
  transactions: Transaction[],
  filters: TransactionFilters,
): Transaction[] {
  const { start, end } = resolveDateRange(filters)

  return transactions.filter((transaction) => {
    if (filters.type !== 'all' && transaction.type !== filters.type) {
      return false
    }
    if (
      filters.categoryId !== 'all' &&
      transaction.categoryId !== filters.categoryId
    ) {
      return false
    }
    if (start && transaction.date < start) return false
    if (end && transaction.date > end) return false
    return true
  })
}
