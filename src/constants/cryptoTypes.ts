import type { CryptoTypeId } from '../types'

export interface CryptoTypeOption {
  id: CryptoTypeId
  label: string
}

export const CRYPTO_TYPES: CryptoTypeOption[] = [
  { id: 'bitcoin', label: 'Bitcoin' },
  { id: 'ethereum', label: 'Ethereum' },
  { id: 'binancecoin', label: 'BNB' },
  { id: 'solana', label: 'Solana' },
  { id: 'ripple', label: 'XRP' },
  { id: 'cardano', label: 'Cardano' },
  { id: 'dogecoin', label: 'Dogecoin' },
  { id: 'tron', label: 'TRON' },
  { id: 'polkadot', label: 'Polkadot' },
  { id: 'avalanche-2', label: 'Avalanche' },
  { id: 'chainlink', label: 'Chainlink' },
  { id: 'litecoin', label: 'Litecoin' },
  { id: 'shiba-inu', label: 'Shiba Inu' },
  { id: 'uniswap', label: 'Uniswap' },
  { id: 'cosmos', label: 'Cosmos' },
  { id: 'stellar', label: 'Stellar' },
  { id: 'monero', label: 'Monero' },
  { id: 'near', label: 'NEAR Protocol' },
  { id: 'aptos', label: 'Aptos' },
  { id: 'the-open-network', label: 'Toncoin' },
]
