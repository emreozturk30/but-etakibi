import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Category, Transaction, TransactionType } from '../types'
import { getCategoriesByType } from '../utils/categoryHelpers'

interface TransactionFormProps {
  categories: Category[]
  editingTransaction: Transaction | null
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void
  onCancelEdit: () => void
}

const today = () => new Date().toISOString().slice(0, 10)

function emptyFormState(categories: Category[], type: TransactionType) {
  return {
    type,
    categoryId: getCategoriesByType(categories, type)[0]?.id ?? '',
    amount: '',
    date: today(),
    note: '',
  }
}

export function TransactionForm({
  categories,
  editingTransaction,
  onSubmit,
  onCancelEdit,
}: TransactionFormProps) {
  const [form, setForm] = useState(() =>
    editingTransaction
      ? {
          type: editingTransaction.type,
          categoryId: editingTransaction.categoryId,
          amount: String(editingTransaction.amount),
          date: editingTransaction.date,
          note: editingTransaction.note ?? '',
        }
      : emptyFormState(categories, 'expense'),
  )
  const [error, setError] = useState('')

  function handleTypeChange(type: TransactionType) {
    setForm((prev) => ({
      ...prev,
      type,
      categoryId: getCategoriesByType(categories, type)[0]?.id ?? '',
    }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const amount = Number(form.amount)
    if (!form.categoryId) {
      setError('Lütfen bir kategori seçin.')
      return
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Lütfen geçerli bir tutar girin.')
      return
    }
    if (!form.date) {
      setError('Lütfen bir tarih seçin.')
      return
    }

    onSubmit({
      type: form.type,
      categoryId: form.categoryId,
      amount,
      date: form.date,
      note: form.note.trim() || undefined,
    })

    setError('')
    setForm(emptyFormState(categories, form.type))
  }

  function handleCancel() {
    setForm(emptyFormState(categories, 'expense'))
    setError('')
    onCancelEdit()
  }

  const categoryOptions = getCategoriesByType(categories, form.type)

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <div className="type-toggle">
        <button
          type="button"
          className={form.type === 'expense' ? 'active' : ''}
          onClick={() => handleTypeChange('expense')}
        >
          Gider
        </button>
        <button
          type="button"
          className={form.type === 'income' ? 'active' : ''}
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
            value={form.amount}
            onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
            placeholder="0.00"
          />
        </label>

        <label>
          Kategori
          <select
            value={form.categoryId}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, categoryId: e.target.value }))
            }
          >
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Tarih
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
          />
        </label>
      </div>

      <label>
        Açıklama (opsiyonel)
        <input
          type="text"
          value={form.note}
          onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
          placeholder="ör. haftalık market alışverişi"
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="submit" className="primary">
          {editingTransaction ? 'Güncelle' : 'Ekle'}
        </button>
        {editingTransaction && (
          <button type="button" onClick={handleCancel}>
            Vazgeç
          </button>
        )}
      </div>
    </form>
  )
}
