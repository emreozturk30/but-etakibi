import { withCorsProxy } from './corsProxy'

export interface StockOption {
  code: string
  name: string
}

const BIGPARA_LIST_URL = 'https://bigpara.hurriyet.com.tr/api/v1/hisse/list'
const TIMEOUT_MS = 10_000

let cachedList: StockOption[] | null = null

export async function fetchStockList(): Promise<StockOption[]> {
  if (cachedList) return cachedList

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch(withCorsProxy(BIGPARA_LIST_URL), {
      signal: controller.signal,
    })
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

  const raw = (data as { data?: unknown } | null)?.data
  if (!Array.isArray(raw)) {
    throw new Error(
      'Fiyat alınamadı, manuel girebilirsiniz. (beklenmeyen veri formatı)',
    )
  }

  const list = raw
    .filter(
      (item): item is { kod: string; ad: string; tip: string } =>
        !!item &&
        typeof item === 'object' &&
        (item as { tip?: unknown }).tip === 'Hisse' &&
        typeof (item as { kod?: unknown }).kod === 'string' &&
        typeof (item as { ad?: unknown }).ad === 'string',
    )
    .map((item) => ({ code: item.kod, name: item.ad }))
    .sort((a, b) => a.name.localeCompare(b.name, 'tr'))

  if (list.length === 0) {
    throw new Error(
      'Fiyat alınamadı, manuel girebilirsiniz. (beklenmeyen veri formatı)',
    )
  }

  cachedList = list
  return list
}
