import { fetchStockData } from './stockData'

export async function fetchStockPrice(stockCode: string): Promise<number> {
  const data = await fetchStockData()
  const entry = data.stocks.find((stock) => stock.code === stockCode)
  const price = entry?.price

  if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) {
    throw new Error(
      'Fiyat alınamadı, manuel girebilirsiniz. (beklenmeyen veri formatı)',
    )
  }

  return price
}
