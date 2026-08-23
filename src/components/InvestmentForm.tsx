import { useState } from 'react'
import type { FormEvent } from 'react'
import type { AssetType, Investment } from '../types'
import { toLocalISODate } from '../utils/dateRanges'

interface InvestmentFormProps {
  editingInvestment: Investment | null
  onSubmit: (investment: Omit<Investment, 'id'>) => void
  onCancelEdit: () => void
}

const today = () => toLocalISODate(new Date())

const ASSET_TYPE_OPTIONS: { value: AssetType; label: string }[] = [
  { value: 'crypto', label: 'Kripto' },
  { value: 'forex', label: 'Döviz' },
  { value: 'gold', label: 'Altın' },
  { value: 'stock', label: 'Hisse Senedi' },
  { value: 'fund', label: 'Fon' },
  { value: 'other', label: 'Diğer' },
]

const PRICE_QUERY_LABEL: Record<AssetType, string> = {
  crypto: 'CoinGecko Coin ID (ör. bitcoin)',
  forex: 'Para Birimi Kodu (ör. USD)',
  gold: "Sembol/Kod (yapılandırılan API'ye gönderilir)",
  stock: "Sembol/Kod (yapılandırılan API'ye gönderilir)",
  fund: "Sembol/Kod (yapılandırılan API'ye gönderilir)",
  other: "Sembol/Kod (yapılandırılan API'ye gönderilir)",
}

function emptyFormState() {
  return {
    name: '',
    assetType: 'crypto' as AssetType,
    quantity: '',
    purchasePrice: '',
    purchaseDate: today(),
    note: '',
    priceQuery: '',
    currentPrice: '',
  }
}

export function InvestmentForm({
  editingInvestment,
  onSubmit,
  onCancelEdit,
}: InvestmentFormProps) {
  const [form, setForm] = useState(() =>
    editingInvestment
      ? {
          name: editingInvestment.name,
          assetType: editingInvestment.assetType,
          quantity: String(editingInvestment.quantity),
          purchasePrice: String(editingInvestment.purchasePrice),
          purchaseDate: editingInvestment.purchaseDate,
          note: editingInvestment.note ?? '',
          priceQuery: editingInvestment.priceQuery,
          currentPrice: String(editingInvestment.currentPrice),
        }
      : emptyFormState(),
  )
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const trimmedName = form.name.trim()
    const quantity = Number(form.quantity)
    const purchasePrice = Number(form.purchasePrice)
    const currentPrice = form.currentPrice
      ? Number(form.currentPrice)
      : purchasePrice

    if (!trimmedName) {
      setError('Lütfen bir yatırım adı girin.')
      return
    }
    if (!Number.isFinite(quantity) || quantity <= 0) {
      setError('Lütfen geçerli bir miktar girin.')
      return
    }
    if (!Number.isFinite(purchasePrice) || purchasePrice <= 0) {
      setError('Lütfen geçerli bir alış fiyatı girin.')
      return
    }
    if (!Number.isFinite(currentPrice) || currentPrice <= 0) {
      setError('Lütfen geçerli bir güncel fiyat girin.')
      return
    }
    if (!form.purchaseDate) {
      setError('Lütfen bir tarih seçin.')
      return
    }

    onSubmit({
      name: trimmedName,
      assetType: form.assetType,
      quantity,
      purchasePrice,
      purchaseDate: form.purchaseDate,
      note: form.note.trim() || undefined,
      priceQuery: form.priceQuery.trim(),
      currentPrice,
    })

    setError('')
    setForm(emptyFormState())
  }

  function handleCancel() {
    setForm(emptyFormState())
    setError('')
    onCancelEdit()
  }

  return (
    <form className="investment-form" onSubmit={handleSubmit}>
      <div className="field-row">
        <label>
          Ad
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="ör. Bitcoin, THYAO, Gram Altın"
          />
        </label>

        <label>
          Varlık Türü
          <select
            value={form.assetType}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, assetType: e.target.value as AssetType }))
            }
          >
            {ASSET_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="field-row">
        <label>
          Miktar
          <input
            type="number"
            min="0"
            step="any"
            value={form.quantity}
            onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))}
            placeholder="0"
          />
        </label>

        <label>
          Alış Fiyatı
          <input
            type="number"
            min="0"
            step="any"
            value={form.purchasePrice}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, purchasePrice: e.target.value }))
            }
            placeholder="0.00"
          />
        </label>

        <label>
          Alış Tarihi
          <input
            type="date"
            value={form.purchaseDate}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, purchaseDate: e.target.value }))
            }
          />
        </label>
      </div>

      <div className="field-row">
        <label>
          {PRICE_QUERY_LABEL[form.assetType]}
          <input
            type="text"
            value={form.priceQuery}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, priceQuery: e.target.value }))
            }
            placeholder={form.assetType === 'crypto' ? 'bitcoin' : form.assetType === 'forex' ? 'USD' : ''}
          />
        </label>

        <label>
          Güncel Fiyat
          <input
            type="number"
            min="0"
            step="any"
            value={form.currentPrice}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, currentPrice: e.target.value }))
            }
            placeholder="Alış fiyatına eşit"
          />
        </label>
      </div>

      <label>
        Not (opsiyonel)
        <input
          type="text"
          value={form.note}
          onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
          placeholder="ör. uzun vadeli birikim"
        />
      </label>

      {error && <p className="form-error">{error}</p>}

      <div className="form-actions">
        <button type="submit" className="primary">
          {editingInvestment ? 'Güncelle' : 'Ekle'}
        </button>
        {editingInvestment && (
          <button type="button" onClick={handleCancel}>
            Vazgeç
          </button>
        )}
      </div>
    </form>
  )
}
