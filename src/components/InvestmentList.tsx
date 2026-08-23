import { useState } from 'react'
import type { Investment } from '../types'
import { GOLD_TYPES } from '../constants/goldTypes'
import { fetchGoldPrice } from '../utils/goldPrice'
import { formatCurrency, formatDate } from '../utils/format'

interface InvestmentListProps {
  investments: Investment[]
  onEdit: (investment: Investment) => void
  onDelete: (id: string) => void
  onUpdatePrice: (id: string, price: number) => void
}

function goldTypeLabel(id: Investment['goldType']): string {
  return GOLD_TYPES.find((option) => option.id === id)?.label ?? id
}

export function InvestmentList({
  investments,
  onEdit,
  onDelete,
  onUpdatePrice,
}: InvestmentListProps) {
  const [rowState, setRowState] = useState<
    Record<string, { loading: boolean; error?: string }>
  >({})
  const [manualDrafts, setManualDrafts] = useState<Record<string, string>>({})

  async function handleFetchPrice(investment: Investment) {
    setRowState((prev) => ({
      ...prev,
      [investment.id]: { loading: true },
    }))
    try {
      const price = await fetchGoldPrice(investment.goldType)
      onUpdatePrice(investment.id, price)
      setRowState((prev) => ({ ...prev, [investment.id]: { loading: false } }))
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Fiyat alınamadı, manuel girebilirsiniz.'
      setRowState((prev) => ({
        ...prev,
        [investment.id]: { loading: false, error: message },
      }))
    }
  }

  function handleManualSave(id: string) {
    const value = Number(manualDrafts[id])
    if (!Number.isFinite(value) || value <= 0) return
    onUpdatePrice(id, value)
    setManualDrafts((prev) => ({ ...prev, [id]: '' }))
  }

  if (investments.length === 0) {
    return <p className="empty-state">Henüz yatırım eklenmedi.</p>
  }

  return (
    <ul className="investment-list">
      {investments.map((investment) => {
        const cost = investment.quantity * investment.purchasePrice
        const value = investment.quantity * investment.currentPrice
        const pl = value - cost
        const plPercent = cost > 0 ? (pl / cost) * 100 : 0
        const plClass = pl > 0 ? 'positive' : pl < 0 ? 'negative' : ''
        const state = rowState[investment.id]

        return (
          <li key={investment.id} className="investment-item">
            <div className="investment-item-header">
              <span className="investment-name">
                {goldTypeLabel(investment.goldType)}
              </span>
              <span className={`investment-pl ${plClass}`}>
                {pl > 0 ? '+' : ''}
                {formatCurrency(pl)} ({plPercent >= 0 ? '+' : ''}
                {plPercent.toFixed(1)}%)
              </span>
            </div>

            <div className="investment-item-body">
              <span>
                {investment.quantity} adet · Alış: {formatCurrency(investment.purchasePrice)} → {formatCurrency(cost)}
              </span>
              <span>
                Güncel: {formatCurrency(investment.currentPrice)} → {formatCurrency(value)}
              </span>
              <span className="investment-detail">
                Alış tarihi: {formatDate(investment.purchaseDate)} · Fiyat güncelleme: {formatDate(investment.priceUpdatedAt)}
              </span>
              {investment.note && (
                <span className="investment-note">{investment.note}</span>
              )}
            </div>

            <div className="investment-item-footer">
              <div className="investment-price-controls">
                <button
                  type="button"
                  disabled={state?.loading}
                  onClick={() => handleFetchPrice(investment)}
                >
                  {state?.loading ? 'Güncelleniyor…' : 'Fiyatı Güncelle'}
                </button>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={manualDrafts[investment.id] ?? ''}
                  onChange={(e) =>
                    setManualDrafts((prev) => ({
                      ...prev,
                      [investment.id]: e.target.value,
                    }))
                  }
                  placeholder="Manuel fiyat"
                />
                <button type="button" onClick={() => handleManualSave(investment.id)}>
                  Kaydet
                </button>
              </div>
              <div className="investment-actions">
                <button type="button" onClick={() => onEdit(investment)}>
                  Düzenle
                </button>
                <button type="button" onClick={() => onDelete(investment.id)}>
                  Sil
                </button>
              </div>
            </div>

            {state?.error && <p className="form-error">{state.error}</p>}
          </li>
        )
      })}
    </ul>
  )
}
