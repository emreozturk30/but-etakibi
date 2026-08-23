import type { RecurringTransaction, Transaction } from '../types'
import { parseLocalDate } from './dateRanges'

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function monthKey(year: number, month: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}`
}

export function computeMissingRecurringTransactions(
  rules: RecurringTransaction[],
  transactions: Transaction[],
  today: Date = new Date(),
): Omit<Transaction, 'id'>[] {
  const missing: Omit<Transaction, 'id'>[] = []
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  for (const rule of rules) {
    const start = parseLocalDate(rule.startDate)
    const startMonth = new Date(start.getFullYear(), start.getMonth(), 1)
    if (startMonth > currentMonth) continue

    const existingMonths = new Set([
      ...transactions
        .filter((transaction) => transaction.recurringId === rule.id)
        .map((transaction) => transaction.date.slice(0, 7)),
      ...(rule.skippedMonths ?? []),
    ])

    const cursor = new Date(startMonth)
    while (cursor <= currentMonth) {
      const year = cursor.getFullYear()
      const month = cursor.getMonth()
      const key = monthKey(year, month)

      if (!existingMonths.has(key)) {
        const day = Math.min(rule.dayOfMonth, daysInMonth(year, month))
        const date = `${key}-${String(day).padStart(2, '0')}`
        missing.push({
          type: rule.type,
          categoryId: rule.categoryId,
          amount: rule.amount,
          date,
          note: rule.note,
          recurringId: rule.id,
        })
      }

      cursor.setMonth(cursor.getMonth() + 1)
    }
  }

  return missing
}
