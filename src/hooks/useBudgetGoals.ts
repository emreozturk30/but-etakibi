import { useEffect, useState } from 'react'
import type { BudgetGoal } from '../types'
import { loadBudgetGoals, saveBudgetGoals } from '../utils/storage'

export function useBudgetGoals() {
  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>(() =>
    loadBudgetGoals(),
  )

  useEffect(() => {
    saveBudgetGoals(budgetGoals)
  }, [budgetGoals])

  function setBudgetGoal(categoryId: string, monthlyLimit: number) {
    setBudgetGoals((prev) => {
      const existing = prev.find((goal) => goal.categoryId === categoryId)
      if (existing) {
        return prev.map((goal) =>
          goal.categoryId === categoryId ? { ...goal, monthlyLimit } : goal,
        )
      }
      return [...prev, { id: crypto.randomUUID(), categoryId, monthlyLimit }]
    })
  }

  function deleteBudgetGoal(categoryId: string) {
    setBudgetGoals((prev) =>
      prev.filter((goal) => goal.categoryId !== categoryId),
    )
  }

  return { budgetGoals, setBudgetGoal, deleteBudgetGoal }
}
