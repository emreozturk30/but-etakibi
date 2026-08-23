import type { GoldTypeId } from '../types'

const TRUNCGIL_URL = 'https://finans.truncgil.com/v4/today.json'
const TIMEOUT_MS = 10_000

export async function fetchGoldPrice(goldTypeId: GoldTypeId): Promise<number> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch(TRUNCGIL_URL, { signal: controller.signal })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Fiyat alınamadı, manuel girebilirsiniz. (zaman aşımı)')
    }
    throw new Error('Fiyat alınamadı, manuel girebilirsiniz. (ağ hatası)')
  } finally {
    clearTimeout(timeoutId)
  }

  if (!response.ok) {
    throw new Error(
      `Fiyat alınamadı, manuel girebilirsiniz. (sunucu hatası: ${response.status})`,
    )
  }

  let data: unknown
  try {
    data = await response.json()
  } catch {
    throw new Error('Fiyat alınamadı, manuel girebilirsiniz. (geçersiz veri)')
  }

  const entry = (data as Record<string, unknown> | null)?.[goldTypeId] as
    | { Buying?: unknown }
    | undefined
  const buying = entry?.Buying

  if (typeof buying !== 'number' || !Number.isFinite(buying) || buying <= 0) {
    throw new Error(
      'Fiyat alınamadı, manuel girebilirsiniz. (beklenmeyen veri formatı)',
    )
  }

  return buying
}
