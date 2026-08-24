import type { Investment } from '../types'
import { fetchGoldPrice } from './goldPrice'
import { fetchCryptoPrice } from './cryptoPrice'
import { fetchForexPrice } from './forexPrice'
import { fetchStockPrice } from './stockPrice'
import { fetchFundPrice } from './fundPrice'

export function fetchPriceForInvestment(investment: Investment): Promise<number> {
  if (investment.assetType === 'gold') return fetchGoldPrice(investment.goldType)
  if (investment.assetType === 'crypto') return fetchCryptoPrice(investment.cryptoType)
  if (investment.assetType === 'forex') return fetchForexPrice(investment.forexType)
  if (investment.assetType === 'stock') return fetchStockPrice(investment.stockCode)
  return fetchFundPrice(investment.fundCode)
}
