import type { Transaction } from '../types'

export interface BalanceSummary {
  totalIncome: number
  totalExpense: number
  net: number
}

export function computeBalanceSummary(transactions: Transaction[]): BalanceSummary {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  return { totalIncome, totalExpense, net: totalIncome - totalExpense }
}
