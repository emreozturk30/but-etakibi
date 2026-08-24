import { useState } from 'react'
import type { FormEvent } from 'react'
import type { BudgetGoal, Category, Transaction } from '../types'
import type { BudgetStatus } from '../utils/budget'
import { getBudgetStatus, getMonthlySpending } from '../utils/budget'
import { getCategoriesByType, getCategoryById } from '../utils/categoryHelpers'
import { formatCurrency } from '../utils/format'

interface BudgetGoalsProps {
  categories: Category[]
  budgetGoals: BudgetGoal[]
  transactions: Transaction[]
  onSetGoal: (categoryId: string, monthlyLimit: number) => void
  onDeleteGoal: (categoryId: string) => void
}

const STATUS_LABEL: Record<BudgetStatus, string> = {
  good: 'İyi durumda',
  warning: 'Limite yaklaşıyor',
  critical: 'Limit aşıldı',
}

const STATUS_ICON: Record<BudgetStatus, string> = {
  good: '●',
  warning: '▲',
  critical: '✕',
}

export function BudgetGoals({
  categories,
  budgetGoals,
  transactions,
  onSetGoal,
  onDeleteGoal,
}: BudgetGoalsProps) {
  const expenseCategories = getCategoriesByType(categories, 'expense')
  const [categoryId, setCategoryId] = useState(expenseCategories[0]?.id ?? '')
  const [limit, setLimit] = useState('')
  const [error, setError] = useState('')

  function handleCategoryChange(id: string) {
    setCategoryId(id)
    const existing = budgetGoals.find((goal) => goal.categoryId === id)
    setLimit(existing ? String(existing.monthlyLimit) : '')
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const value = Number(limit)

    if (!categoryId) {
      setError('Lütfen bir kategori seçin.')
      return
    }
    if (!Number.isFinite(value) || value <= 0) {
      setError('Lütfen geçerli bir tutar girin.')
      return
    }

    onSetGoal(categoryId, value)
    setError('')
  }

  if (expenseCategories.length === 0) {
    return <p className="empty-state">Bütçe hedefi belirlemek için önce bir gider kategorisi olmalı.</p>
  }

  return (
    <div className="budget-goals">
      <form className="budget-form" onSubmit={handleSubmit}>
        <select
          value={categoryId}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          {expenseCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="0"
          step="0.01"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          placeholder="Aylık limit"
        />
        <button type="submit" className="primary">
          Kaydet
        </button>
      </form>
      {error && <p className="form-error">{error}</p>}

      {budgetGoals.length === 0 ? (
        <p className="empty-state">Henüz bütçe hedefi belirlenmedi.</p>
      ) : (
        <ul className="budget-list">
          {budgetGoals.map((goal) => {
            const category = getCategoryById(categories, goal.categoryId)
            const spent = getMonthlySpending(transactions, goal.categoryId)
            const status = getBudgetStatus(spent, goal.monthlyLimit)
            const percent = Math.min((spent / goal.monthlyLimit) * 100, 100)

            return (
              <li key={goal.id} className="budget-item">
                <div className="budget-item-header">
                  <span className="budget-category">
                    {category?.name ?? 'Bilinmeyen kategori'}
                  </span>
                  <span className="budget-status">
                    <span
                      className={`budget-status-icon status-${status}`}
                      aria-hidden="true"
                    >
                      {STATUS_ICON[status]}
                    </span>{' '}
                    {STATUS_LABEL[status]}
                  </span>
                </div>
                <div className="budget-progress-track">
                  <div
                    className={`budget-progress-fill status-${status}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="budget-item-footer">
                  <span>
                    {formatCurrency(spent)} / {formatCurrency(goal.monthlyLimit)}
                  </span>
                  <button className="danger" type="button" onClick={() => onDeleteGoal(goal.categoryId)}>
                    Sil
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
