import { useState } from 'react'
import './App.css'
import { Balance } from './components/Balance'
import { TransactionForm } from './components/TransactionForm'
import { TransactionList } from './components/TransactionList'
import { useTransactions } from './hooks/useTransactions'
import type { Transaction } from './types'

function App() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } =
    useTransactions()
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null)

  function handleSubmit(transaction: Omit<Transaction, 'id'>) {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transaction)
      setEditingTransaction(null)
    } else {
      addTransaction(transaction)
    }
  }

  function handleDelete(id: string) {
    if (editingTransaction?.id === id) {
      setEditingTransaction(null)
    }
    deleteTransaction(id)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Bütçe Takip</h1>
        <p>Gelir ve giderlerini takip et.</p>
      </header>

      <main>
        <Balance transactions={transactions} />

        <TransactionForm
          key={editingTransaction?.id ?? 'new'}
          editingTransaction={editingTransaction}
          onSubmit={handleSubmit}
          onCancelEdit={() => setEditingTransaction(null)}
        />

        <TransactionList
          transactions={transactions}
          onEdit={setEditingTransaction}
          onDelete={handleDelete}
        />
      </main>
    </div>
  )
}

export default App
