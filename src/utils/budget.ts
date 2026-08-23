import type { Transaction } from '../types'
import { getMonthRange } from './dateRanges'

export function getMonthlySpending(
  transactions: Transaction[],
  categoryId: string,
): number {
  const { start, end } = getMonthRange(0)
  return transactions
    .filter(
      (transaction) =>
        transaction.type === 'expense' &&
        transaction.categoryId === categoryId &&
        transaction.date >= start &&
        transaction.date <= end,
    )
    .reduce((sum, transaction) => sum + transaction.amount, 0)
}

export type BudgetStatus = 'good' | 'warning' | 'critical'

export function getBudgetStatus(spent: number, limit: number): BudgetStatus {
  if (limit <= 0) return 'good'
  const ratio = spent / limit
  if (ratio >= 1) return 'critical'
  if (ratio >= 0.9) return 'warning'
  return 'good'
}
