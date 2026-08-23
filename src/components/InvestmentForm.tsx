import { useState } from 'react'
import type { FormEvent } from 'react'
import type { GoldTypeId, Investment } from '../types'
import { GOLD_TYPES } from '../constants/goldTypes'
import { toLocalISODate } from '../utils/dateRanges'

interface InvestmentFormProps {
  editingInvestment: Investment | null
  onSubmit: (investment: Omit<Investment, 'id' | 'priceUpdatedAt'>) => void
  onCancelEdit: () => void
}

const today = () => toLocalISODate(new Date())

function emptyFormState() {
  return {
    goldType: GOLD_TYPES[0].id,
    quantity: '',
    purchasePrice: '',
    purchaseDate: today(),
    currentPrice: '',
    note: '',
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
          goldType: editingInvestment.goldType,
          quantity: String(editingInvestment.quantity),
          purchasePrice: String(editingInvestment.purchasePrice),
          purchaseDate: editingInvestment.purchaseDate,
          currentPrice: String(editingInvestment.currentPrice),
          note: editingInvestment.note ?? '',
        }
      : emptyFormState(),
  )
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const quantity = Number(form.quantity)
    const purchasePrice = Number(form.purchasePrice)
    const currentPrice = form.currentPrice
      ? Number(form.currentPrice)
      : purchasePrice

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
      assetType: 'gold',
      goldType: form.goldType,
      quantity,
      purchasePrice,
      purchaseDate: form.purchaseDate,
      currentPrice,
      note: form.note.trim() || undefined,
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
          Varlık Türü
          <select value="gold" disabled>
            <option value="gold">Altın</option>
          </select>
        </label>

        <label>
          Altın Türü
          <select
            value={form.goldType}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                goldType: e.target.value as GoldTypeId,
              }))
            }
          >
            {GOLD_TYPES.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

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
      </div>

      <div className="field-row">
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

        <label>
          Güncel Fiyat (opsiyonel)
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
        Açıklama (opsiyonel)
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
