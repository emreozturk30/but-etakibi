import type { TransactionType } from './index'

export type DateRangePreset = 'all' | 'this-month' | 'last-month' | 'custom'

export interface TransactionFilters {
  type: TransactionType | 'all'
  categoryId: string | 'all'
  rangePreset: DateRangePreset
  customStart: string
  customEnd: string
}

export const DEFAULT_FILTERS: TransactionFilters = {
  type: 'all',
  categoryId: 'all',
  rangePreset: 'all',
  customStart: '',
  customEnd: '',
}
