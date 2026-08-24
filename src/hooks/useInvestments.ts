import { useEffect, useRef, useState } from 'react'
import type { DistributiveOmit, Investment } from '../types'
import { loadInvestments, saveInvestments } from '../utils/storage'
import { toLocalISODate } from '../utils/dateRanges'
import { fetchPriceForInvestment } from '../utils/fetchInvestmentPrice'

const AUTO_REFRESH_INTERVAL_MS = 5 * 60 * 1000

export function useInvestments() {
  const [investments, setInvestments] = useState<Investment[]>(() =>
    loadInvestments(),
  )

  useEffect(() => {
    saveInvestments(investments)
  }, [investments])

  const investmentsRef = useRef(investments)
  useEffect(() => {
    investmentsRef.current = investments
  })

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (document.visibilityState !== 'visible') return
      for (const investment of investmentsRef.current) {
        fetchPriceForInvestment(investment)
          .then((price) => updateInvestmentPrice(investment.id, price))
          .catch(() => {})
      }
    }, AUTO_REFRESH_INTERVAL_MS)
    return () => clearInterval(intervalId)
  }, [])

  function addInvestment(investment: DistributiveOmit<Investment, 'id'>) {
    setInvestments((prev) => [
      ...prev,
      { ...investment, id: crypto.randomUUID() },
    ])
  }

  function updateInvestment(
    id: string,
    updates: DistributiveOmit<Investment, 'id'>,
  ) {
    setInvestments((prev) =>
      prev.map((investment) =>
        investment.id === id ? { ...updates, id } : investment,
      ),
    )
  }

  function deleteInvestment(id: string) {
    setInvestments((prev) => prev.filter((investment) => investment.id !== id))
  }

  function updateInvestmentPrice(id: string, currentPrice: number) {
    setInvestments((prev) =>
      prev.map((investment) =>
        investment.id === id
          ? {
              ...investment,
              currentPrice,
              priceUpdatedAt: toLocalISODate(new Date()),
            }
          : investment,
      ),
    )
  }

  return {
    investments,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    updateInvestmentPrice,
  }
}
