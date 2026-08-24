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

export type AssetType = 'gold' | 'crypto' | 'forex'

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

export type CryptoTypeId =
  | 'bitcoin'
  | 'ethereum'
  | 'binancecoin'
  | 'solana'
  | 'ripple'
  | 'cardano'
  | 'dogecoin'
  | 'tron'
  | 'polkadot'
  | 'avalanche-2'
  | 'chainlink'
  | 'litecoin'
  | 'shiba-inu'
  | 'uniswap'
  | 'cosmos'
  | 'stellar'
  | 'monero'
  | 'near'
  | 'aptos'
  | 'the-open-network'

export type ForexTypeId =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'CHF'
  | 'CAD'
  | 'AUD'
  | 'JPY'
  | 'SAR'
  | 'AED'
  | 'RUB'
  | 'CNY'
  | 'DKK'
  | 'SEK'
  | 'NOK'
  | 'NZD'

interface InvestmentBase {
  id: string
  quantity: number
  purchasePrice: number
  purchaseDate: string
  currentPrice: number
  priceUpdatedAt: string
  note?: string
}

export interface GoldInvestment extends InvestmentBase {
  assetType: 'gold'
  goldType: GoldTypeId
}

export interface CryptoInvestment extends InvestmentBase {
  assetType: 'crypto'
  cryptoType: CryptoTypeId
}

export interface ForexInvestment extends InvestmentBase {
  assetType: 'forex'
  forexType: ForexTypeId
}

export type Investment = GoldInvestment | CryptoInvestment | ForexInvestment

// Standard `Omit` doesn't distribute over unions (it collapses to only the
// shared keys), which would silently drop `goldType`/`cryptoType`. This
// distributes `Omit` across each union member individually.
export type DistributiveOmit<T, K extends keyof never> = T extends unknown
  ? Omit<T, K>
  : never
