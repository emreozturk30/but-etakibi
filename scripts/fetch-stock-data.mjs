import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const BIGPARA_LIST_URL = 'https://bigpara.hurriyet.com.tr/api/v1/hisse/list'
const BIGPARA_DETAIL_URL =
  'https://bigpara.hurriyet.com.tr/api/v1/borsa/hisseyuzeysel/'
const REQUEST_TIMEOUT_MS = 8_000
const CONCURRENCY = 20

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'stock-data.json')

async function fetchWithTimeout(url) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const response = await fetch(url, { signal: controller.signal })
    if (!response.ok) {
      throw new Error(`sunucu hatası: ${response.status}`)
    }
    return await response.json()
  } finally {
    clearTimeout(timeoutId)
  }
}

async function fetchStockList() {
  const data = await fetchWithTimeout(BIGPARA_LIST_URL)
  const raw = data?.data
  if (!Array.isArray(raw)) {
    throw new Error('Hisse listesi beklenmeyen bir formatta döndü.')
  }
  return raw
    .filter(
      (item) =>
        item &&
        typeof item === 'object' &&
        item.tip === 'Hisse' &&
        typeof item.kod === 'string' &&
        typeof item.ad === 'string',
    )
    .map((item) => ({ code: item.kod, name: item.ad }))
    .sort((a, b) => a.name.localeCompare(b.name, 'tr'))
}

async function fetchStockPrice(code) {
  const data = await fetchWithTimeout(
    `${BIGPARA_DETAIL_URL}${encodeURIComponent(code)}`,
  )
  const price = data?.data?.hisseYuzeysel?.kapanis
  if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) {
    throw new Error('beklenmeyen veri formatı')
  }
  return price
}

async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length)
  let nextIndex = 0

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex
      nextIndex += 1
      results[currentIndex] = await fn(items[currentIndex])
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, worker),
  )
  return results
}

async function main() {
  const list = await fetchStockList()
  console.log(`Hisse listesi alındı: ${list.length} hisse.`)

  let failureCount = 0
  const withPrices = await mapWithConcurrency(list, CONCURRENCY, async (stock) => {
    try {
      const price = await fetchStockPrice(stock.code)
      return { ...stock, price }
    } catch (error) {
      failureCount += 1
      console.warn(`Fiyat alınamadı, atlanıyor: ${stock.code} (${error.message})`)
      return null
    }
  })

  const stocks = withPrices.filter((entry) => entry !== null)
  console.log(
    `${stocks.length} hisse için fiyat alındı, ${failureCount} hisse atlandı.`,
  )

  const output = {
    generatedAt: new Date().toISOString(),
    stocks,
  }

  await writeFile(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`)
  console.log(`Yazıldı: ${OUTPUT_PATH}`)
}

main().catch((error) => {
  console.error('Hisse verisi güncellenemedi:', error)
  process.exit(1)
})
