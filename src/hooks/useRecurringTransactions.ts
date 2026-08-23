import { useEffect, useState } from 'react'
import type { RecurringTransaction } from '../types'
import {
  loadRecurringTransactions,
  saveRecurringTransactions,
} from '../utils/storage'

export function useRecurringTransactions() {
  const [recurringTransactions, setRecurringTransactions] = useState<
    RecurringTransaction[]
  >(() => loadRecurringTransactions())

  useEffect(() => {
    saveRecurringTransactions(recurringTransactions)
  }, [recurringTransactions])

  function addRecurringTransaction(rule: Omit<RecurringTransaction, 'id'>) {
    setRecurringTransactions((prev) => [
      ...prev,
      { ...rule, id: crypto.randomUUID() },
    ])
  }

  function deleteRecurringTransaction(id: string) {
    setRecurringTransactions((prev) => prev.filter((rule) => rule.id !== id))
  }

  return {
    recurringTransactions,
    addRecurringTransaction,
    deleteRecurringTransaction,
  }
}
