import { useEffect, useState } from 'react'
import type { Investment } from '../types'
import { loadInvestments, saveInvestments } from '../utils/storage'

export function useInvestments() {
  const [investments, setInvestments] = useState<Investment[]>(() =>
    loadInvestments(),
  )

  useEffect(() => {
    saveInvestments(investments)
  }, [investments])

  function addInvestment(investment: Omit<Investment, 'id'>) {
    setInvestments((prev) => [
      ...prev,
      { ...investment, id: crypto.randomUUID() },
    ])
  }

  function updateInvestment(id: string, updates: Omit<Investment, 'id'>) {
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
          ? { ...investment, currentPrice, priceUpdatedAt: new Date().toISOString() }
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
