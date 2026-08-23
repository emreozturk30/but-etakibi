import type { Category } from '../types'

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'market-gida', name: 'Market/Gıda', type: 'expense' },
  { id: 'kira-konut', name: 'Kira/Konut', type: 'expense' },
  { id: 'faturalar', name: 'Faturalar', type: 'expense' },
  { id: 'ulasim', name: 'Ulaşım', type: 'expense' },
  { id: 'saglik', name: 'Sağlık', type: 'expense' },
  { id: 'egitim', name: 'Eğitim', type: 'expense' },
  { id: 'giyim', name: 'Giyim', type: 'expense' },
  { id: 'eglence-sosyal', name: 'Eğlence/Sosyal', type: 'expense' },
  { id: 'abonelikler', name: 'Abonelikler', type: 'expense' },
  { id: 'borc-kredi', name: 'Borç/Kredi Ödemesi', type: 'expense' },
  { id: 'diger-gider', name: 'Diğer', type: 'expense' },
]

export const INCOME_CATEGORIES: Category[] = [
  { id: 'maas', name: 'Maaş', type: 'income' },
  { id: 'ek-gelir', name: 'Ek Gelir/Serbest Çalışma', type: 'income' },
  { id: 'yatirim-geliri', name: 'Yatırım Geliri', type: 'income' },
  { id: 'diger-gelir', name: 'Hediye/Diğer', type: 'income' },
]

export const DEFAULT_CATEGORIES: Category[] = [
  ...INCOME_CATEGORIES,
  ...EXPENSE_CATEGORIES,
]
