import type { Category, Transaction } from '../types'
import { getCategoryById } from '../utils/categoryHelpers'
import { formatCurrency, formatDate } from '../utils/format'

interface TransactionListProps {
  categories: Category[]
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}

export function TransactionList({
  categories,
  transactions,
  onEdit,
  onDelete,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return <p className="empty-state">Henüz bir işlem eklenmedi.</p>
  }

  const sorted = [...transactions].sort((a, b) =>
    b.date.localeCompare(a.date),
  )

  return (
    <ul className="transaction-list">
      {sorted.map((transaction) => {
        const category = getCategoryById(categories, transaction.categoryId)
        return (
          <li key={transaction.id} className="transaction-item">
            <div className="transaction-info">
              <span className="transaction-category">
                {category?.name ?? 'Bilinmeyen kategori'}
              </span>
              <span className="transaction-date">
                {formatDate(transaction.date)}
              </span>
              {transaction.note && (
                <span className="transaction-note">{transaction.note}</span>
              )}
            </div>

            <span
              className={
                transaction.type === 'income'
                  ? 'transaction-amount income'
                  : 'transaction-amount expense'
              }
            >
              {transaction.type === 'income' ? '+' : '-'}
              {formatCurrency(transaction.amount)}
            </span>

            <div className="transaction-actions">
              <button type="button" onClick={() => onEdit(transaction)}>
                Düzenle
              </button>
              <button type="button" onClick={() => onDelete(transaction.id)}>
                Sil
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
