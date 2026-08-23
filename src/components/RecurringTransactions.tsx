import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Category, RecurringTransaction, TransactionType } from '../types'
import { getCategoriesByType, getCategoryById } from '../utils/categoryHelpers'
import { toLocalISODate } from '../utils/dateRanges'
import { formatCurrency } from '../utils/format'

interface RecurringTransactionsProps {
  categories: Category[]
  recurringTransactions: RecurringTransaction[]
  onAdd: (rule: Omit<RecurringTransaction, 'id'>) => void
  onDelete: (id: string) => void
}

const today = () => toLocalISODate(new Date())

export function RecurringTransactions({
  categories,
  recurringTransactions,
  onAdd,
  onDelete,
}: RecurringTransactionsProps) {
  const [type, setType] = useState<TransactionType>('expense')
  const [categoryId, setCategoryId] = useState(
    () => getCategoriesByType(categories, 'expense')[0]?.id ?? '',
  )
  const [amount, setAmount] = useState('')
  const [dayOfMonth, setDayOfMonth] = useState('1')
  const [startDate, setStartDate] = useState(today)
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  const categoryOptions = getCategoriesByType(categories, type)

  function handleTypeChange(nextType: TransactionType) {
    setType(nextType)
    setCategoryId(getCategoriesByType(categories, nextType)[0]?.id ?? '')
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const amountValue = Number(amount)
    const dayValue = Number(dayOfMonth)

    if (!categoryId) {
      setError('Lütfen bir kategori seçin.')
      return
    }
    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      setError('Lütfen geçerli bir tutar girin.')
      return
    }
    if (!Number.isInteger(dayValue) || dayValue < 1 || dayValue > 31) {
      setError('Lütfen 1 ile 31 arasında bir gün girin.')
      return
    }
    if (!startDate) {
      setError('Lütfen bir başlangıç tarihi seçin.')
      return
    }

    onAdd({
      type,
      categoryId,
      amount: amountValue,
      dayOfMonth: dayValue,
      startDate,
      note: note.trim() || undefined,
    })

    setAmount('')
    setNote('')
    setError('')
  }

  return (
    <div className="recurring-transactions">
      <form className="recurring-form" onSubmit={handleSubmit}>
        <div className="type-toggle">
          <button
            type="button"
            className={type === 'expense' ? 'active' : ''}
            onClick={() => handleTypeChange('expense')}
          >
            Gider
          </button>
          <button
            type="button"
            className={type === 'income' ? 'active' : ''}
            onClick={() => handleTypeChange('income')}
          >
            Gelir
          </button>
        </div>

        <div className="field-row">
          <label>
            Tutar
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </label>

          <label>
            Kategori
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categoryOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Ayın Günü
            <input
              type="number"
              min="1"
              max="31"
              value={dayOfMonth}
              onChange={(e) => setDayOfMonth(e.target.value)}
            />
          </label>

          <label>
            Başlangıç
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
        </div>

        <label>
          Açıklama (opsiyonel)
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="ör. kira ödemesi"
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="primary">
            Ekle
          </button>
        </div>
      </form>

      {recurringTransactions.length === 0 ? (
        <p className="empty-state">Henüz tekrarlayan işlem eklenmedi.</p>
      ) : (
        <ul className="recurring-list">
          {recurringTransactions.map((rule) => {
            const category = getCategoryById(categories, rule.categoryId)
            return (
              <li key={rule.id} className="recurring-item">
                <div className="recurring-info">
                  <span className="recurring-category">
                    {category?.name ?? 'Bilinmeyen kategori'}
                  </span>
                  <span className="recurring-detail">
                    Her ayın {rule.dayOfMonth}. günü
                  </span>
                </div>
                <span
                  className={
                    rule.type === 'income'
                      ? 'transaction-amount income'
                      : 'transaction-amount expense'
                  }
                >
                  {rule.type === 'income' ? '+' : '-'}
                  {formatCurrency(rule.amount)}
                </span>
                <button type="button" onClick={() => onDelete(rule.id)}>
                  Sil
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
