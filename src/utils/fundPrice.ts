import { fetchFundData } from './fundData'

export async function fetchFundPrice(fundCode: string): Promise<number> {
  const data = await fetchFundData()
  const entry = data.funds.find((fund) => fund.code === fundCode)
  const price = entry?.price

  if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) {
    throw new Error(
      'Fiyat alınamadı, manuel girebilirsiniz. (beklenmeyen veri formatı)',
    )
  }

  return price
}
