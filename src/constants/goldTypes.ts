import type { GoldTypeId } from '../types'

export interface GoldTypeOption {
  id: GoldTypeId
  label: string
}

export const GOLD_TYPES: GoldTypeOption[] = [
  { id: 'GRA', label: 'Gram Altın' },
  { id: 'HAS', label: 'Gram Has Altın' },
  { id: 'CEYREKALTIN', label: 'Çeyrek Altın' },
  { id: 'YARIMALTIN', label: 'Yarım Altın' },
  { id: 'TAMALTIN', label: 'Tam Altın' },
  { id: 'CUMHURIYETALTINI', label: 'Cumhuriyet Altını' },
  { id: 'ATAALTIN', label: 'Ata Altın' },
  { id: '14AYARALTIN', label: '14 Ayar Altın' },
  { id: '18AYARALTIN', label: '18 Ayar Altın' },
  { id: 'YIA', label: '22 Ayar Bilezik' },
]
