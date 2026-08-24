import type { ForexTypeId } from '../types'

export interface ForexTypeOption {
  id: ForexTypeId
  label: string
}

export const FOREX_TYPES: ForexTypeOption[] = [
  { id: 'USD', label: 'ABD Doları' },
  { id: 'EUR', label: 'Euro' },
  { id: 'GBP', label: 'İngiliz Sterlini' },
  { id: 'CHF', label: 'İsviçre Frangı' },
  { id: 'CAD', label: 'Kanada Doları' },
  { id: 'AUD', label: 'Avustralya Doları' },
  { id: 'JPY', label: 'Japon Yeni' },
  { id: 'SAR', label: 'Suudi Arabistan Riyali' },
  { id: 'AED', label: 'BAE Dirhemi' },
  { id: 'RUB', label: 'Rus Rublesi' },
  { id: 'CNY', label: 'Çin Yuanı' },
  { id: 'DKK', label: 'Danimarka Kronu' },
  { id: 'SEK', label: 'İsveç Kronu' },
  { id: 'NOK', label: 'Norveç Kronu' },
  { id: 'NZD', label: 'Yeni Zelanda Doları' },
]
