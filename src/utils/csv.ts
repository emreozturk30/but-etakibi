import type { Category, Transaction } from '../types'
import { getCategoryById } from './categoryHelpers'
import { formatDate } from './format'

const DELIMITER = ';'

function escapeField(value: string): string {
  if (value.includes(DELIMITER) || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function formatAmountForCsv(amount: number): string {
  return amount.toFixed(2).replace('.', ',')
}

export function transactionsToCsv(
  transactions: Transaction[],
  categories: Category[],
): string {
  const header = ['Tarih', 'Tür', 'Kategori', 'Tutar', 'Açıklama']
  const rows = [...transactions]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((transaction) => {
      const category = getCategoryById(categories, transaction.categoryId)
      return [
        formatDate(transaction.date),
        transaction.type === 'income' ? 'Gelir' : 'Gider',
        category?.name ?? 'Bilinmeyen kategori',
        formatAmountForCsv(transaction.amount),
        transaction.note ?? '',
      ]
        .map(escapeField)
        .join(DELIMITER)
    })

  return [header.join(DELIMITER), ...rows].join('\r\n')
}

export function downloadCsv(filename: string, csvContent: string): void {
  const blob = new Blob(['\ufeff' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
