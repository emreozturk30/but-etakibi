import { useState } from 'react'
import type { FormEvent } from 'react'
import type {
  Category,
  RecurringTransaction,
  Transaction,
  TransactionType,
} from '../types'

interface CategoryManagerProps {
  categories: Category[]
  customCategories: Category[]
  transactions: Transaction[]
  recurringTransactions: RecurringTransaction[]
  onAdd: (name: string, type: TransactionType) => void
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
}

export function CategoryManager({
  categories,
  customCategories,
  transactions,
  recurringTransactions,
  onAdd,
  onRename,
  onDelete,
}: CategoryManagerProps) {
  const [name, setName] = useState('')
  const [type, setType] = useState<TransactionType>('expense')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = name.trim()

    if (!trimmed) {
      setError('Lütfen bir kategori adı girin.')
      return
    }

    const isDuplicate = categories.some(
      (category) =>
        category.type === type &&
        category.name.toLocaleLowerCase('tr-TR') ===
          trimmed.toLocaleLowerCase('tr-TR'),
    )
    if (isDuplicate) {
      setError('Bu isimde bir kategori zaten var.')
      return
    }

    onAdd(trimmed, type)
    setName('')
    setError('')
  }

  function isInUse(id: string) {
    return (
      transactions.some((transaction) => transaction.categoryId === id) ||
      recurringTransactions.some((rule) => rule.categoryId === id)
    )
  }

  function startEditing(category: Category) {
    setEditingId(category.id)
    setEditingName(category.name)
  }

  function saveEditing(id: string) {
    const trimmed = editingName.trim()
    if (!trimmed) return
    onRename(id, trimmed)
    setEditingId(null)
  }

  return (
    <div className="category-manager">
      <form className="category-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Yeni kategori adı"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as TransactionType)}
        >
          <option value="expense">Gider</option>
          <option value="income">Gelir</option>
        </select>
        <button type="submit" className="primary">
          Ekle
        </button>
      </form>
      {error && <p className="form-error">{error}</p>}

      {customCategories.length === 0 ? (
        <p className="empty-state">Henüz özel kategori eklenmedi.</p>
      ) : (
        <ul className="category-list">
          {customCategories.map((category) => (
            <li key={category.id} className="category-item">
              {editingId === category.id ? (
                <>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    autoFocus
                  />
                  <div className="category-actions">
                    <button type="button" onClick={() => saveEditing(category.id)}>
                      Kaydet
                    </button>
                    <button type="button" onClick={() => setEditingId(null)}>
                      Vazgeç
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="category-name">{category.name}</span>
                  <span className="category-type">
                    {category.type === 'income' ? 'Gelir' : 'Gider'}
                  </span>
                  <div className="category-actions">
                    <button type="button" onClick={() => startEditing(category)}>
                      Düzenle
                    </button>
                    <button
                      className="danger"
                      type="button"
                      disabled={isInUse(category.id)}
                      title={
                        isInUse(category.id)
                          ? 'Bu kategori işlemlerde kullanılıyor, silinemez'
                          : undefined
                      }
                      onClick={() => onDelete(category.id)}
                    >
                      Sil
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
