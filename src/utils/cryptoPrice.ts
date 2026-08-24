import type { CryptoTypeId } from '../types'

const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple/price'
const TIMEOUT_MS = 10_000

export async function fetchCryptoPrice(cryptoType: CryptoTypeId): Promise<number> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch(
      `${COINGECKO_URL}?ids=${cryptoType}&vs_currencies=try`,
      { signal: controller.signal },
    )
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

  const entry = (data as Record<string, unknown> | null)?.[cryptoType] as
    | { try?: unknown }
    | undefined
  const price = entry?.try

  if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) {
    throw new Error(
      'Fiyat alınamadı, manuel girebilirsiniz. (beklenmeyen veri formatı)',
    )
  }

  return price
}
