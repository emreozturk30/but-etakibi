export interface FundDataEntry {
  code: string
  name: string
  price: number
}

interface FundDataFile {
  generatedAt: string | null
  funds: FundDataEntry[]
}

const FUND_DATA_URL = `${import.meta.env.BASE_URL}fund-data.json`
const TIMEOUT_MS = 10_000

export async function fetchFundData(): Promise<FundDataFile> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

  let response: Response
  try {
    response = await fetch(FUND_DATA_URL, {
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

  const funds = (data as { funds?: unknown } | null)?.funds
  if (!Array.isArray(funds)) {
    throw new Error(
      'Fiyat alınamadı, manuel girebilirsiniz. (beklenmeyen veri formatı)',
    )
  }

  return data as FundDataFile
}
