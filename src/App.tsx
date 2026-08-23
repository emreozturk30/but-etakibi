import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import './App.css'
import { Balance } from './components/Balance'
import { BudgetGoals } from './components/BudgetGoals'
import { CategoryManager } from './components/CategoryManager'
import { ExportButton } from './components/ExportButton'
import { Filters } from './components/Filters'
import { InvestmentForm } from './components/InvestmentForm'
import { InvestmentList } from './components/InvestmentList'
import type { AppView } from './components/NavDrawer'
import { NavDrawer } from './components/NavDrawer'
import { PriceSourceSettings } from './components/PriceSourceSettings'
import { RecurringTransactions } from './components/RecurringTransactions'
import { ThemeToggle } from './components/ThemeToggle'
import { TransactionForm } from './components/TransactionForm'
import { TransactionList } from './components/TransactionList'
import { useBudgetGoals } from './hooks/useBudgetGoals'
import { useCategories } from './hooks/useCategories'
import { useInvestments } from './hooks/useInvestments'
import { usePriceSources } from './hooks/usePriceSources'
import { useRecurringTransactions } from './hooks/useRecurringTransactions'
import { useTheme } from './hooks/useTheme'
import { useTransactions } from './hooks/useTransactions'
import type { Investment, Transaction } from './types'
import { DEFAULT_FILTERS } from './types/filters'
import { filterTransactions } from './utils/filterTransactions'
import { computeMissingRecurringTransactions } from './utils/recurring'

const CategoryBreakdownChart = lazy(() =>
  import('./components/CategoryBreakdownChart').then((m) => ({
    default: m.CategoryBreakdownChart,
  })),
)
const MonthlyTrendChart = lazy(() =>
  import('./components/MonthlyTrendChart').then((m) => ({
    default: m.MonthlyTrendChart,
  })),
)
const CumulativeBalanceChart = lazy(() =>
  import('./components/CumulativeBalanceChart').then((m) => ({
    default: m.CumulativeBalanceChart,
  })),
)

function App() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } =
    useTransactions()
  const { categories, customCategories, addCategory, renameCategory, deleteCategory } =
    useCategories()
  const { budgetGoals, setBudgetGoal, deleteBudgetGoal } = useBudgetGoals()
  const { theme, setTheme } = useTheme()
  const {
    recurringTransactions,
    addRecurringTransaction,
    deleteRecurringTransaction,
    skipRecurringMonth,
  } = useRecurringTransactions()
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [view, setView] = useState<AppView>('dashboard')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingInvestment, setEditingInvestment] =
    useState<Investment | null>(null)
  const {
    investments,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    updateInvestmentPrice,
  } = useInvestments()
  const { priceSources, setPriceSource, deletePriceSource } = usePriceSources()

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
      updateTransaction(editingTransaction.id, {
        ...transaction,
        recurringId: editingTransaction.recurringId,
      })
      setEditingTransaction(null)
    } else {
      addTransaction(transaction)
    }
  }

  function handleDelete(id: string) {
    if (editingTransaction?.id === id) {
      setEditingTransaction(null)
    }
    const transaction = transactions.find((t) => t.id === id)
    if (transaction?.recurringId) {
      skipRecurringMonth(transaction.recurringId, transaction.date.slice(0, 7))
    }
    deleteTransaction(id)
  }

  function handleInvestmentSubmit(investment: Omit<Investment, 'id'>) {
    if (editingInvestment) {
      const priceUpdatedAt =
        investment.currentPrice === editingInvestment.currentPrice
          ? editingInvestment.priceUpdatedAt
          : new Date().toISOString()
      updateInvestment(editingInvestment.id, { ...investment, priceUpdatedAt })
      setEditingInvestment(null)
    } else {
      addInvestment(investment)
    }
  }

  function handleInvestmentDelete(id: string) {
    if (editingInvestment?.id === id) {
      setEditingInvestment(null)
    }
    deleteInvestment(id)
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
        <button
          type="button"
          className="menu-button"
          aria-label="Menü"
          aria-haspopup="true"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen(true)}
        >
          ⋮
        </button>
        <ThemeToggle theme={theme} onChange={setTheme} />
        <h1>Bütçe Takip</h1>
        <p>Gelir ve giderlerini takip et.</p>
      </header>

      <NavDrawer
        open={drawerOpen}
        view={view}
        onNavigate={(nextView) => {
          setView(nextView)
          setDrawerOpen(false)
        }}
        onClose={() => setDrawerOpen(false)}
      />

      <main>
        {view === 'dashboard' && (
          <>
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
              <Suspense fallback={<p className="empty-state">Grafik yükleniyor…</p>}>
                <CategoryBreakdownChart
                  categories={categories}
                  transactions={filteredTransactions}
                />
              </Suspense>
            </section>

            <section className="panel">
              <h2>Aylık Gelir/Gider Trendi</h2>
              <Suspense fallback={<p className="empty-state">Grafik yükleniyor…</p>}>
                <MonthlyTrendChart transactions={trendTransactions} />
              </Suspense>
            </section>

            <section className="panel">
              <h2>Net Birikim (Kümülatif)</h2>
              <Suspense fallback={<p className="empty-state">Grafik yükleniyor…</p>}>
                <CumulativeBalanceChart transactions={trendTransactions} />
              </Suspense>
            </section>

            <TransactionList
              categories={categories}
              transactions={filteredTransactions}
              onEdit={setEditingTransaction}
              onDelete={handleDelete}
            />
          </>
        )}

        {view === 'investments' && (
          <>
            <InvestmentForm
              key={editingInvestment?.id ?? 'new'}
              editingInvestment={editingInvestment}
              onSubmit={handleInvestmentSubmit}
              onCancelEdit={() => setEditingInvestment(null)}
            />

            <InvestmentList
              investments={investments}
              priceSources={priceSources}
              onEdit={setEditingInvestment}
              onDelete={handleInvestmentDelete}
              onUpdatePrice={updateInvestmentPrice}
            />

            <section className="panel">
              <h2>Fiyat Kaynakları</h2>
              <PriceSourceSettings
                priceSources={priceSources}
                onSet={setPriceSource}
                onDelete={deletePriceSource}
              />
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default App
