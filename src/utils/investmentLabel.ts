import type { Investment } from '../types'
import { GOLD_TYPES } from '../constants/goldTypes'
import { CRYPTO_TYPES } from '../constants/cryptoTypes'
import { FOREX_TYPES } from '../constants/forexTypes'

export function investmentLabel(investment: Investment): string {
  if (investment.assetType === 'gold') {
    return (
      GOLD_TYPES.find((option) => option.id === investment.goldType)?.label ??
      investment.goldType
    )
  }
  if (investment.assetType === 'crypto') {
    return (
      CRYPTO_TYPES.find((option) => option.id === investment.cryptoType)
        ?.label ?? investment.cryptoType
    )
  }
  if (investment.assetType === 'forex') {
    return (
      FOREX_TYPES.find((option) => option.id === investment.forexType)
        ?.label ?? investment.forexType
    )
  }
  if (investment.assetType === 'stock') {
    return `${investment.stockName} (${investment.stockCode})`
  }
  return `${investment.fundName} (${investment.fundCode})`
}
