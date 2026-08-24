import { fetchStockData } from './stockData'

export interface StockOption {
  code: string
  name: string
}

export async function fetchStockList(): Promise<StockOption[]> {
  const data = await fetchStockData()

  if (data.stocks.length === 0) {
    throw new Error(
      'Fiyat alınamadı, manuel girebilirsiniz. (beklenmeyen veri formatı)',
    )
  }

  return data.stocks.map((stock) => ({ code: stock.code, name: stock.name }))
}
