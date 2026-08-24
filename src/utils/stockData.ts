export interface StockDataEntry {
  code: string
  name: string
  price: number
}

interface StockDataFile {
  generatedAt: string | null
  stocks: StockDataEntry[]
}

const STOCK_DATA_URL = `${import.meta.env.BASE_URL}stock-data.json`
const TIMEOUT_MS = 10_000

export async function fetchStockData(): Promise<StockDataFile> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch(STOCK_DATA_URL, {
      signal: controller.signal,
      cache: 'no-store',
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

  const stocks = (data as { stocks?: unknown } | null)?.stocks
  if (!Array.isArray(stocks)) {
    throw new Error(
      'Fiyat alınamadı, manuel girebilirsiniz. (beklenmeyen veri formatı)',
    )
  }

  return data as StockDataFile
}
