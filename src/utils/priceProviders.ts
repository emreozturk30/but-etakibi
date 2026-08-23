import type { Investment, PriceSourceConfig, PriceSources } from '../types'

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json()
  } catch {
    throw new Error('Fiyat alınamadı, manuel girebilirsiniz. (Geçersiz yanıt)')
  }
}

function assertPositiveFinite(value: unknown): number {
  const price = Number(value)
  if (!Number.isFinite(price) || price <= 0) {
    throw new Error(
      'Fiyat alınamadı, manuel girebilirsiniz. (Beklenmeyen veri formatı)',
    )
  }
  return price
}

export async function fetchCryptoPrice(coinGeckoId: string): Promise<number> {
  const id = coinGeckoId.trim().toLowerCase()
  if (!id) throw new Error('Lütfen bir CoinGecko coin ID girin.')
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(id)}&vs_currencies=try`
  let response: Response
  try {
    response = await fetch(url)
  } catch {
    throw new Error('Fiyat alınamadı, manuel girebilirsiniz. (Ağ hatası)')
  }
  if (!response.ok) {
    throw new Error(`Fiyat alınamadı, manuel girebilirsiniz. (HTTP ${response.status})`)
  }
  const json = (await readJson(response)) as Record<string, { try?: number }>
  return assertPositiveFinite(json?.[id]?.try)
}

export async function fetchForexRate(currencyCode: string): Promise<number> {
  const code = currencyCode.trim().toUpperCase()
  if (!code) throw new Error('Lütfen bir para birimi kodu girin.')
  const url = `https://api.frankfurter.app/latest?from=${encodeURIComponent(code)}&to=TRY`
  let response: Response
  try {
    response = await fetch(url)
  } catch {
    throw new Error('Fiyat alınamadı, manuel girebilirsiniz. (Ağ hatası)')
  }
  if (!response.ok) {
    throw new Error(`Fiyat alınamadı, manuel girebilirsiniz. (HTTP ${response.status})`)
  }
  const json = (await readJson(response)) as { rates?: { TRY?: number } }
  return assertPositiveFinite(json?.rates?.TRY)
}

export function getJsonPath(data: unknown, path: string): unknown {
  return path
    .trim()
    .split('.')
    .filter(Boolean)
    .reduce<unknown>((acc, key) => {
      if (acc == null) return undefined
      return (acc as Record<string, unknown>)[key]
    }, data)
}

export async function fetchGenericPrice(
  config: PriceSourceConfig,
  symbol: string,
): Promise<number> {
  const url = config.urlTemplate.replace('{symbol}', encodeURIComponent(symbol))
  let response: Response
  try {
    response = await fetch(url)
  } catch {
    throw new Error('Fiyat alınamadı, manuel girebilirsiniz. (Ağ hatası)')
  }
  if (!response.ok) {
    throw new Error(`Fiyat alınamadı, manuel girebilirsiniz. (HTTP ${response.status})`)
  }
  const json = await readJson(response)
  return assertPositiveFinite(getJsonPath(json, config.jsonPath))
}

export async function fetchInvestmentPrice(
  investment: Pick<Investment, 'assetType' | 'priceQuery'>,
  priceSources: PriceSources,
): Promise<number> {
  if (investment.assetType === 'crypto') {
    return fetchCryptoPrice(investment.priceQuery)
  }
  if (investment.assetType === 'forex') {
    return fetchForexRate(investment.priceQuery)
  }

  const config = priceSources[investment.assetType]
  if (!config) {
    throw new Error(
      'Bu varlık türü için fiyat kaynağı yapılandırılmamış. Lütfen Fiyat Kaynakları ayarlarından ekleyin.',
    )
  }
  return fetchGenericPrice(config, investment.priceQuery)
}
