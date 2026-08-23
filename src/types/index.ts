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

export type AssetType = 'gold'

export type GoldTypeId =
  | 'GRA'
  | 'HAS'
  | 'CEYREKALTIN'
  | 'YARIMALTIN'
  | 'TAMALTIN'
  | 'CUMHURIYETALTINI'
  | 'ATAALTIN'
  | '14AYARALTIN'
  | '18AYARALTIN'
  | 'YIA'

export interface Investment {
  id: string
  assetType: AssetType
  goldType: GoldTypeId
  quantity: number
  purchasePrice: number
  purchaseDate: string
  currentPrice: number
  priceUpdatedAt: string
  note?: string
}
