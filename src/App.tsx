import { useMemo, useState } from 'react'
import './App.css'
import { Balance } from './components/Balance'
import { CategoryBreakdownChart } from './components/CategoryBreakdownChart'
import { Filters } from './components/Filters'
import { MonthlyTrendChart } from './components/MonthlyTrendChart'
import { TransactionForm } from './components/TransactionForm'
import { TransactionList } from './components/TransactionList'
import { useTransactions } from './hooks/useTransactions'
import type { Transaction } from './types'
import { DEFAULT_FILTERS } from './types/filters'
import { filterTransactions } from './utils/filterTransactions'

function App() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } =
    useTransactions()
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, filters),
    [transactions, filters],
  )

  const trendTransactions = useMemo(
    () =>
      filterTransactions(transactions, { ...filters, rangePreset: 'all' }),
    [transactions, filters],
  )

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
        <TransactionForm
          key={editingTransaction?.id ?? 'new'}
          editingTransaction={editingTransaction}
          onSubmit={handleSubmit}
          onCancelEdit={() => setEditingTransaction(null)}
        />

        <section className="panel">
          <h2>Filtreler</h2>
          <Filters filters={filters} onChange={setFilters} />
        </section>

        <Balance transactions={filteredTransactions} />

        <section className="panel">
          <h2>Kategori Bazlı Harcama Özeti</h2>
          <CategoryBreakdownChart transactions={filteredTransactions} />
        </section>

        <section className="panel">
          <h2>Aylık Gelir/Gider Trendi</h2>
          <MonthlyTrendChart transactions={trendTransactions} />
        </section>

        <TransactionList
          transactions={filteredTransactions}
          onEdit={setEditingTransaction}
          onDelete={handleDelete}
        />
      </main>
    </div>
  )
}

export default App
