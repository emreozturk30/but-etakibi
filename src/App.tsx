import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { Balance } from './components/Balance'
import { BudgetGoals } from './components/BudgetGoals'
import { CategoryBreakdownChart } from './components/CategoryBreakdownChart'
import { CategoryManager } from './components/CategoryManager'
import { ExportButton } from './components/ExportButton'
import { Filters } from './components/Filters'
import { MonthlyTrendChart } from './components/MonthlyTrendChart'
import { RecurringTransactions } from './components/RecurringTransactions'
import { TransactionForm } from './components/TransactionForm'
import { TransactionList } from './components/TransactionList'
import { useBudgetGoals } from './hooks/useBudgetGoals'
import { useCategories } from './hooks/useCategories'
import { useRecurringTransactions } from './hooks/useRecurringTransactions'
import { useTransactions } from './hooks/useTransactions'
import type { Transaction } from './types'
import { DEFAULT_FILTERS } from './types/filters'
import { filterTransactions } from './utils/filterTransactions'
import { computeMissingRecurringTransactions } from './utils/recurring'

function App() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } =
    useTransactions()
  const { categories, customCategories, addCategory, renameCategory, deleteCategory } =
    useCategories()
  const { budgetGoals, setBudgetGoal, deleteBudgetGoal } = useBudgetGoals()
  const {
    recurringTransactions,
    addRecurringTransaction,
    deleteRecurringTransaction,
  } = useRecurringTransactions()
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  useEffect(() => {
    const missing = computeMissingRecurringTransactions(
      recurringTransactions,
      transactions,
    )
    missing.forEach(addTransaction)
  }, [recurringTransactions, transactions, addTransaction])

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

  function handleDeleteCategory(id: string) {
    const isInUse =
      transactions.some((transaction) => transaction.categoryId === id) ||
      recurringTransactions.some((rule) => rule.categoryId === id)
    if (isInUse) return
    if (filters.categoryId === id) {
      setFilters((prev) => ({ ...prev, categoryId: 'all' }))
    }
    deleteCategory(id)
    deleteBudgetGoal(id)
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
          categories={categories}
          editingTransaction={editingTransaction}
          onSubmit={handleSubmit}
          onCancelEdit={() => setEditingTransaction(null)}
        />

        <section className="panel">
          <h2>Kategoriler</h2>
          <CategoryManager
            categories={categories}
            customCategories={customCategories}
            transactions={transactions}
            recurringTransactions={recurringTransactions}
            onAdd={addCategory}
            onRename={renameCategory}
            onDelete={handleDeleteCategory}
          />
        </section>

        <section className="panel">
          <h2>Tekrarlayan İşlemler</h2>
          <RecurringTransactions
            categories={categories}
            recurringTransactions={recurringTransactions}
            onAdd={addRecurringTransaction}
            onDelete={deleteRecurringTransaction}
          />
        </section>

        <section className="panel">
          <h2>Filtreler</h2>
          <Filters categories={categories} filters={filters} onChange={setFilters} />
        </section>

        <section className="panel">
          <h2>Dışa Aktar</h2>
          <ExportButton categories={categories} transactions={filteredTransactions} />
        </section>

        <Balance transactions={filteredTransactions} />

        <section className="panel">
          <h2>Aylık Bütçe Hedefleri</h2>
          <BudgetGoals
            categories={categories}
            budgetGoals={budgetGoals}
            transactions={transactions}
            onSetGoal={setBudgetGoal}
            onDeleteGoal={deleteBudgetGoal}
          />
        </section>

        <section className="panel">
          <h2>Kategori Bazlı Harcama Özeti</h2>
          <CategoryBreakdownChart
            categories={categories}
            transactions={filteredTransactions}
          />
        </section>

        <section className="panel">
          <h2>Aylık Gelir/Gider Trendi</h2>
          <MonthlyTrendChart transactions={trendTransactions} />
        </section>

        <TransactionList
          categories={categories}
          transactions={filteredTransactions}
          onEdit={setEditingTransaction}
          onDelete={handleDelete}
        />
      </main>
    </div>
  )
}

export default App
