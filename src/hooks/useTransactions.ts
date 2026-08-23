import { useCallback, useEffect, useState } from 'react'
import type { Transaction } from '../types'
import { loadTransactions, saveTransactions } from '../utils/storage'

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadTransactions(),
  )

  useEffect(() => {
    saveTransactions(transactions)
  }, [transactions])

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    setTransactions((prev) => [
      ...prev,
      { ...transaction, id: crypto.randomUUID() },
    ])
  }, [])

  function updateTransaction(id: string, updates: Omit<Transaction, 'id'>) {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === id ? { ...updates, id } : transaction,
      ),
    )
  }

  function deleteTransaction(id: string) {
    setTransactions((prev) =>
      prev.filter((transaction) => transaction.id !== id),
    )
  }

  return { transactions, addTransaction, updateTransaction, deleteTransaction }
}
