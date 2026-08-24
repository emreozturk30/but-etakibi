import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const INFO_URL = 'https://www.tefas.gov.tr/api/funds/fonGnlBlgSiraliGetir'
const FUND_KINDS = ['YAT', 'EMK', 'BYF', 'GYF', 'GSYF']
const LOOKBACK_DAYS = 7
const REQUEST_TIMEOUT_MS = 20_000
const DEFAULT_RATE_LIMIT_WAIT_MS = 15_000

const HEADERS = {
  Accept: '*/*',
  'Content-Type': 'application/json',
  Origin: 'https://www.tefas.gov.tr',
  Referer: 'https://www.tefas.gov.tr/tr/fon-verileri',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'fund-data.json')

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function formatDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}${m}${d}`
}

async function fetchFundKind(kind, basTarih, bitTarih) {
  const body = {
    fonTipi: kind,
    fonKodu: null,
    aramaMetni: null,
    fonTurKod: null,
    fonGrubu: null,
    sfonTurKod: null,
    fonTurAciklama: null,
    kurucuKod: null,
    basTarih,
    bitTarih,
    basSira: 1,
    bitSira: 100000,
    dil: 'TR',
    sFonTurKod: '',
    fonKod: '',
    fonGrup: '',
    fonUnvanTip: '',
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  let response
  try {
    response = await fetch(INFO_URL, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(body),
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeoutId)
  }

  if (response.status === 429) {
    const reset = response.headers.get('ratelimit-reset')
    const waitMs =
      reset && /^\d+$/.test(reset)
        ? (Number(reset) + 1) * 1000
        : DEFAULT_RATE_LIMIT_WAIT_MS
    console.warn(`${kind}: hız sınırı (429), ${waitMs}ms bekleniyor.`)
    await sleep(waitMs)
    return fetchFundKind(kind, basTarih, bitTarih)
  }

  if (!response.ok) {
    throw new Error(`${kind}: sunucu hatası ${response.status}`)
  }

  const data = await response.json()
  const errMsg = data?.errorMessage
  const isEmptyMarker =
    typeof errMsg === 'string' &&
    (errMsg.toLowerCase().includes('out of bounds') ||
      errMsg.toLowerCase().includes('veri bulunamadı'))
  if ((data?.errorCode || errMsg) && !isEmptyMarker) {
    throw new Error(`${kind}: TEFAS API hatası - ${errMsg} (${data?.errorCode})`)
  }

  return Array.isArray(data?.resultList) ? data.resultList : []
}

async function main() {
  const today = new Date()
  const start = new Date(today)
  start.setDate(start.getDate() - LOOKBACK_DAYS)
  const basTarih = formatDate(start)
  const bitTarih = formatDate(today)

  const latestByCode = new Map()

  for (const kind of FUND_KINDS) {
    const rows = await fetchFundKind(kind, basTarih, bitTarih)
    console.log(`${kind}: ${rows.length} satır alındı.`)

    for (const row of rows) {
      const code = row?.fonKodu
      const name = row?.fonUnvan
      const date = row?.tarih
      const price = row?.fiyat
      if (
        typeof code !== 'string' ||
        typeof name !== 'string' ||
        typeof date !== 'string' ||
        typeof price !== 'number' ||
        !Number.isFinite(price) ||
        price <= 0
      ) {
        continue
      }
      const existing = latestByCode.get(code)
      if (!existing || date > existing.date) {
        latestByCode.set(code, { code, name, price, date })
      }
    }
  }

  const funds = Array.from(latestByCode.values())
    .map(({ code, name, price }) => ({ code, name, price }))
    .sort((a, b) => a.name.localeCompare(b.name, 'tr'))

  console.log(`Toplam ${funds.length} fon için fiyat bulundu.`)

  const output = {
    generatedAt: new Date().toISOString(),
    funds,
  }

  await writeFile(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`)
  console.log(`Yazıldı: ${OUTPUT_PATH}`)
}

main().catch((error) => {
  console.error('Fon verisi güncellenemedi:', error)
  process.exit(1)
})
