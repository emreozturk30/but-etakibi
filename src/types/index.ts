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
}
