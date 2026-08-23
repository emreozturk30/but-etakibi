export type TransactionType = 'income' | 'expense'

export interface Category {
  id: string
  name: string
  type: TransactionType
}

export interface Transaction {
  id: string
  amount: number
  type: TransactionType
  categoryId: string
  date: string
  note?: string
  recurringId?: string
}

export interface BudgetGoal {
  id: string
  categoryId: string
  monthlyLimit: number
}

export interface RecurringTransaction {
  id: string
  type: TransactionType
  categoryId: string
  amount: number
  note?: string
  dayOfMonth: number
  startDate: string
  skippedMonths?: string[]
}

export type AssetType = 'crypto' | 'forex' | 'gold' | 'stock' | 'fund' | 'other'

export interface Investment {
  id: string
  name: string
  assetType: AssetType
  quantity: number
  purchasePrice: number
  purchaseDate: string
  note?: string
  priceQuery: string
  currentPrice: number
  priceUpdatedAt?: string
}

export interface PriceSourceConfig {
  urlTemplate: string
  jsonPath: string
}

export type PriceSources = Partial<Record<AssetType, PriceSourceConfig>>
