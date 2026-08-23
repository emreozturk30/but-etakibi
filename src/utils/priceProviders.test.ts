import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  fetchCryptoPrice,
  fetchForexRate,
  fetchGenericPrice,
  fetchInvestmentPrice,
  getJsonPath,
} from './priceProviders'
import type { PriceSourceConfig, PriceSources } from '../types'

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response
}

function badJsonResponse(ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: () => Promise.reject(new Error('invalid json')),
  } as Response
}

describe('getJsonPath', () => {
  it('okur iç içe obje yolunu', () => {
    expect(getJsonPath({ rates: { TRY: 34.5 } }, 'rates.TRY')).toBe(34.5)
  })

  it('dizi indeksini okur', () => {
    expect(getJsonPath({ data: [{ value: 12 }] }, 'data.0.value')).toBe(12)
  })

  it('eksik yolda undefined döner', () => {
    expect(getJsonPath({ a: 1 }, 'a.b.c')).toBeUndefined()
  })
})

describe('fetchCryptoPrice', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('başarılı yanıtta fiyatı döner', async () => {
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse({ bitcoin: { try: 1234.5 } }),
    )
    await expect(fetchCryptoPrice('bitcoin')).resolves.toBe(1234.5)
  })

  it('HTTP hata kodunda reddeder', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({}, false, 500))
    await expect(fetchCryptoPrice('bitcoin')).rejects.toThrow(
      'Fiyat alınamadı, manuel girebilirsiniz. (HTTP 500)',
    )
  })

  it('bozuk JSON gövdesinde reddeder', async () => {
    vi.mocked(fetch).mockResolvedValue(badJsonResponse())
    await expect(fetchCryptoPrice('bitcoin')).rejects.toThrow(
      'Geçersiz yanıt',
    )
  })

  it('beklenen alan eksikse reddeder', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({ bitcoin: {} }))
    await expect(fetchCryptoPrice('bitcoin')).rejects.toThrow(
      'Beklenmeyen veri formatı',
    )
  })

  it('boş id ile ağa hiç çıkmadan reddeder', async () => {
    await expect(fetchCryptoPrice('  ')).rejects.toThrow(
      'Lütfen bir CoinGecko coin ID girin.',
    )
    expect(fetch).not.toHaveBeenCalled()
  })
})

describe('fetchForexRate', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('başarılı yanıtta kuru döner', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({ rates: { TRY: 34.5 } }))
    await expect(fetchForexRate('usd')).resolves.toBe(34.5)
  })

  it('HTTP hata kodunda reddeder', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({}, false, 404))
    await expect(fetchForexRate('USD')).rejects.toThrow('HTTP 404')
  })
})

describe('fetchGenericPrice', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  const config: PriceSourceConfig = {
    urlTemplate: 'https://example.com/price?symbol={symbol}&apikey=XXXX',
    jsonPath: 'data.0.value',
  }

  it('doğru jsonPath ile fiyatı çıkarır', async () => {
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse({ data: [{ value: 99.9 }] }),
    )
    await expect(fetchGenericPrice(config, 'XAU')).resolves.toBe(99.9)
    expect(fetch).toHaveBeenCalledWith(
      'https://example.com/price?symbol=XAU&apikey=XXXX',
    )
  })

  it('yanlış jsonPath ile hata verir', async () => {
    const wrongConfig: PriceSourceConfig = { ...config, jsonPath: 'nope' }
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse({ data: [{ value: 99.9 }] }),
    )
    await expect(fetchGenericPrice(wrongConfig, 'XAU')).rejects.toThrow(
      'Beklenmeyen veri formatı',
    )
  })

  it('ağ hatasında reddeder', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('network down'))
    await expect(fetchGenericPrice(config, 'XAU')).rejects.toThrow('Ağ hatası')
  })
})

describe('fetchInvestmentPrice', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('crypto için CoinGecko uç noktasına gider', async () => {
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse({ bitcoin: { try: 1000 } }),
    )
    const price = await fetchInvestmentPrice(
      { assetType: 'crypto', priceQuery: 'bitcoin' },
      {},
    )
    expect(price).toBe(1000)
    expect(vi.mocked(fetch).mock.calls[0][0]).toContain('coingecko')
  })

  it('forex için Frankfurter uç noktasına gider', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({ rates: { TRY: 34.5 } }))
    const price = await fetchInvestmentPrice(
      { assetType: 'forex', priceQuery: 'USD' },
      {},
    )
    expect(price).toBe(34.5)
    expect(vi.mocked(fetch).mock.calls[0][0]).toContain('frankfurter')
  })

  it('yapılandırılmamış genel tür için net hata verir', async () => {
    await expect(
      fetchInvestmentPrice({ assetType: 'gold', priceQuery: 'XAU' }, {}),
    ).rejects.toThrow('fiyat kaynağı yapılandırılmamış')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('yapılandırılmış genel tür için fetchGenericPrice kullanır', async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({ price: 2500 }))
    const priceSources: PriceSources = {
      gold: { urlTemplate: 'https://example.com/{symbol}', jsonPath: 'price' },
    }
    const price = await fetchInvestmentPrice(
      { assetType: 'gold', priceQuery: 'XAU' },
      priceSources,
    )
    expect(price).toBe(2500)
  })
})
