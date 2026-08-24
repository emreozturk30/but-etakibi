import { fetchFundData } from './fundData'

export interface FundOption {
  code: string
  name: string
}

export async function fetchFundList(): Promise<FundOption[]> {
  const data = await fetchFundData()

  if (data.funds.length === 0) {
    throw new Error(
      'Fiyat alınamadı, manuel girebilirsiniz. (beklenmeyen veri formatı)',
    )
  }

  return data.funds.map((fund) => ({ code: fund.code, name: fund.name }))
}
