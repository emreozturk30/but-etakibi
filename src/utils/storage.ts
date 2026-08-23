import type {
  BudgetGoal,
  Category,
  Investment,
  PriceSources,
  RecurringTransaction,
  Transaction,
} from '../types'

const TRANSACTIONS_KEY = 'but-etakibi:transactions'
const CUSTOM_CATEGORIES_KEY = 'but-etakibi:custom-categories'
const BUDGET_GOALS_KEY = 'but-etakibi:budget-goals'
const RECURRING_TRANSACTIONS_KEY = 'but-etakibi:recurring-transactions'
const INVESTMENTS_KEY = 'but-etakibi:investments'
const PRICE_SOURCES_KEY = 'but-etakibi:price-sources'

export function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(TRANSACTIONS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Transaction[]
  } catch {
    return []
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions))
}

export function loadCustomCategories(): Category[] {
  try {
    const raw = localStorage.getItem(CUSTOM_CATEGORIES_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Category[]
  } catch {
    return []
  }
}

export function saveCustomCategories(categories: Category[]): void {
  localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(categories))
}

export function loadBudgetGoals(): BudgetGoal[] {
  try {
    const raw = localStorage.getItem(BUDGET_GOALS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as BudgetGoal[]
  } catch {
    return []
  }
}

export function saveBudgetGoals(budgetGoals: BudgetGoal[]): void {
  localStorage.setItem(BUDGET_GOALS_KEY, JSON.stringify(budgetGoals))
}

export function loadRecurringTransactions(): RecurringTransaction[] {
  try {
    const raw = localStorage.getItem(RECURRING_TRANSACTIONS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as RecurringTransaction[]
  } catch {
    return []
  }
}

export function saveRecurringTransactions(
  recurringTransactions: RecurringTransaction[],
): void {
  localStorage.setItem(
    RECURRING_TRANSACTIONS_KEY,
    JSON.stringify(recurringTransactions),
  )
}

export function loadInvestments(): Investment[] {
  try {
    const raw = localStorage.getItem(INVESTMENTS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Investment[]
  } catch {
    return []
  }
}

export function saveInvestments(investments: Investment[]): void {
  localStorage.setItem(INVESTMENTS_KEY, JSON.stringify(investments))
}

export function loadPriceSources(): PriceSources {
  try {
    const raw = localStorage.getItem(PRICE_SOURCES_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as PriceSources
  } catch {
    return {}
  }
}

export function savePriceSources(priceSources: PriceSources): void {
  localStorage.setItem(PRICE_SOURCES_KEY, JSON.stringify(priceSources))
}
