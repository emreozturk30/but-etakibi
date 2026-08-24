import { withCorsProxy } from './corsProxy'

const BIGPARA_DETAIL_URL =
  'https://bigpara.hurriyet.com.tr/api/v1/borsa/hisseyuzeysel/'
// CORS proxy üzerinden gittiği için diğer varlık türlerinin doğrudan
// isteklerinden (10sn) daha uzun bir süre tanınıyor.
const TIMEOUT_MS = 20_000

export async function fetchStockPrice(stockCode: string): Promise<number> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch(
      withCorsProxy(`${BIGPARA_DETAIL_URL}${encodeURIComponent(stockCode)}`),
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

  const price = (
    data as { data?: { hisseYuzeysel?: { kapanis?: unknown } } } | null
  )?.data?.hisseYuzeysel?.kapanis

  if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) {
    throw new Error(
      'Fiyat alınamadı, manuel girebilirsiniz. (beklenmeyen veri formatı)',
    )
  }

  return price
}
