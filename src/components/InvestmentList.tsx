import { useState } from 'react'
import type { AssetType, Investment, PriceSources } from '../types'
import { fetchInvestmentPrice } from '../utils/priceProviders'
import { formatCurrency, formatDate } from '../utils/format'

interface InvestmentListProps {
  investments: Investment[]
  priceSources: PriceSources
  onEdit: (investment: Investment) => void
  onDelete: (id: string) => void
  onUpdatePrice: (id: string, price: number) => void
}

const ASSET_TYPE_LABEL: Record<AssetType, string> = {
  crypto: 'Kripto',
  forex: 'Döviz',
  gold: 'Altın',
  stock: 'Hisse Senedi',
  fund: 'Fon',
  other: 'Diğer',
}

function formatDateTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}

export function InvestmentList({
  investments,
  priceSources,
  onEdit,
  onDelete,
  onUpdatePrice,
}: InvestmentListProps) {
  const [fetchingId, setFetchingId] = useState<string | null>(null)
  const [priceErrors, setPriceErrors] = useState<Record<string, string>>({})
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null)
  const [editingPriceValue, setEditingPriceValue] = useState('')

  async function handleFetchPrice(investment: Investment) {
    setFetchingId(investment.id)
    setPriceErrors((prev) => ({ ...prev, [investment.id]: '' }))
    try {
      const price = await fetchInvestmentPrice(investment, priceSources)
      onUpdatePrice(investment.id, price)
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Fiyat alınamadı, manuel girebilirsiniz.'
      setPriceErrors((prev) => ({ ...prev, [investment.id]: message }))
    } finally {
      setFetchingId(null)
    }
  }

  function startEditingPrice(investment: Investment) {
    setEditingPriceId(investment.id)
    setEditingPriceValue(String(investment.currentPrice))
  }

  function saveEditingPrice(id: string) {
    const value = Number(editingPriceValue)
    if (!Number.isFinite(value) || value <= 0) return
    onUpdatePrice(id, value)
    setEditingPriceId(null)
  }

  if (investments.length === 0) {
    return <p className="empty-state">Henüz yatırım eklenmedi.</p>
  }

  return (
    <ul className="investment-list">
      {investments.map((investment) => {
        const totalCost = investment.quantity * investment.purchasePrice
        const currentValue = investment.quantity * investment.currentPrice
        const profitLoss = currentValue - totalCost
        const profitLossPercent =
          totalCost > 0 ? (profitLoss / totalCost) * 100 : 0
        const plClass = profitLoss >= 0 ? 'positive' : 'negative'

        return (
          <li key={investment.id} className="investment-item">
            <div className="investment-item-header">
              <span className="investment-name">{investment.name}</span>
              <span className="investment-type">
                {ASSET_TYPE_LABEL[investment.assetType]}
              </span>
            </div>

            <div className="investment-details">
              <span>Miktar: {investment.quantity}</span>
              <span>Alış: {formatCurrency(investment.purchasePrice)}</span>
              <span>Güncel: {formatCurrency(investment.currentPrice)}</span>
              <span>Maliyet: {formatCurrency(totalCost)}</span>
              <span>Değer: {formatCurrency(currentValue)}</span>
            </div>

            <div className="investment-pl-row">
              <span className={`investment-pl ${plClass}`}>
                {profitLoss >= 0 ? '+' : ''}
                {formatCurrency(profitLoss)} ({profitLossPercent >= 0 ? '+' : ''}
                {profitLossPercent.toFixed(2)}%)
              </span>
              <span className="investment-updated-at">
                Son güncelleme:{' '}
                {investment.priceUpdatedAt
                  ? formatDateTime(investment.priceUpdatedAt)
                  : '—'}
              </span>
            </div>

            {investment.note && (
              <p className="investment-note">{investment.note}</p>
            )}

            {editingPriceId === investment.id ? (
              <div className="investment-price-edit">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={editingPriceValue}
                  onChange={(e) => setEditingPriceValue(e.target.value)}
                  autoFocus
                />
                <button type="button" onClick={() => saveEditingPrice(investment.id)}>
                  Kaydet
                </button>
                <button type="button" onClick={() => setEditingPriceId(null)}>
                  Vazgeç
                </button>
              </div>
            ) : (
              <div className="investment-actions">
                <button
                  type="button"
                  disabled={fetchingId === investment.id}
                  onClick={() => handleFetchPrice(investment)}
                >
                  {fetchingId === investment.id
                    ? 'Güncelleniyor…'
                    : 'Fiyatı Güncelle'}
                </button>
                <button type="button" onClick={() => startEditingPrice(investment)}>
                  Fiyatı Elle Gir
                </button>
                <button type="button" onClick={() => onEdit(investment)}>
                  Düzenle
                </button>
                <button type="button" onClick={() => onDelete(investment.id)}>
                  Sil
                </button>
              </div>
            )}

            {priceErrors[investment.id] && (
              <p className="form-error">{priceErrors[investment.id]}</p>
            )}

            <p className="investment-purchase-date">
              Alış tarihi: {formatDate(investment.purchaseDate)}
            </p>
          </li>
        )
      })}
    </ul>
  )
}
