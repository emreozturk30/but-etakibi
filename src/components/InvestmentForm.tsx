import { useState } from 'react'
import type { FormEvent } from 'react'
import type {
  AssetType,
  CryptoTypeId,
  DistributiveOmit,
  ForexTypeId,
  GoldTypeId,
  Investment,
} from '../types'
import { GOLD_TYPES } from '../constants/goldTypes'
import { CRYPTO_TYPES } from '../constants/cryptoTypes'
import { FOREX_TYPES } from '../constants/forexTypes'
import { useFundList } from '../hooks/useFundList'
import { useStockList } from '../hooks/useStockList'
import { toLocalISODate } from '../utils/dateRanges'

interface InvestmentFormProps {
  editingInvestment: Investment | null
  onSubmit: (investment: DistributiveOmit<Investment, 'id' | 'priceUpdatedAt'>) => void
  onCancelEdit: () => void
}

const today = () => toLocalISODate(new Date())

function emptyFormState(assetType: AssetType) {
  return {
    assetType,
    goldType: GOLD_TYPES[0].id,
    cryptoType: CRYPTO_TYPES[0].id,
    forexType: FOREX_TYPES[0].id,
    stockCode: '',
    stockName: '',
    fundCode: '',
    fundName: '',
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
  const [form, setForm] = useState(() => {
    if (!editingInvestment) return emptyFormState('gold')
    const shared = {
      quantity: String(editingInvestment.quantity),
      purchasePrice: String(editingInvestment.purchasePrice),
      purchaseDate: editingInvestment.purchaseDate,
      currentPrice: String(editingInvestment.currentPrice),
      note: editingInvestment.note ?? '',
    }
    if (editingInvestment.assetType === 'gold') {
      return {
        assetType: 'gold' as const,
        goldType: editingInvestment.goldType,
        cryptoType: CRYPTO_TYPES[0].id,
        forexType: FOREX_TYPES[0].id,
        stockCode: '',
        stockName: '',
        fundCode: '',
        fundName: '',
        ...shared,
      }
    }
    if (editingInvestment.assetType === 'crypto') {
      return {
        assetType: 'crypto' as const,
        cryptoType: editingInvestment.cryptoType,
        goldType: GOLD_TYPES[0].id,
        forexType: FOREX_TYPES[0].id,
        stockCode: '',
        stockName: '',
        fundCode: '',
        fundName: '',
        ...shared,
      }
    }
    if (editingInvestment.assetType === 'forex') {
      return {
        assetType: 'forex' as const,
        forexType: editingInvestment.forexType,
        goldType: GOLD_TYPES[0].id,
        cryptoType: CRYPTO_TYPES[0].id,
        stockCode: '',
        stockName: '',
        fundCode: '',
        fundName: '',
        ...shared,
      }
    }
    if (editingInvestment.assetType === 'stock') {
      return {
        assetType: 'stock' as const,
        stockCode: editingInvestment.stockCode,
        stockName: editingInvestment.stockName,
        goldType: GOLD_TYPES[0].id,
        cryptoType: CRYPTO_TYPES[0].id,
        forexType: FOREX_TYPES[0].id,
        fundCode: '',
        fundName: '',
        ...shared,
      }
    }
    return {
      assetType: 'fund' as const,
      fundCode: editingInvestment.fundCode,
      fundName: editingInvestment.fundName,
      goldType: GOLD_TYPES[0].id,
      cryptoType: CRYPTO_TYPES[0].id,
      forexType: FOREX_TYPES[0].id,
      stockCode: '',
      stockName: '',
      ...shared,
    }
  })
  const stockList = useStockList()
  const fundList = useFundList()
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
    if (form.assetType === 'stock' && !form.stockCode) {
      setError('Lütfen bir hisse seçin.')
      return
    }
    if (form.assetType === 'fund' && !form.fundCode) {
      setError('Lütfen bir fon seçin.')
      return
    }

    const shared = {
      quantity,
      purchasePrice,
      purchaseDate: form.purchaseDate,
      currentPrice,
      note: form.note.trim() || undefined,
    }

    let payload: DistributiveOmit<Investment, 'id' | 'priceUpdatedAt'>
    if (form.assetType === 'gold') {
      payload = { assetType: 'gold', goldType: form.goldType, ...shared }
    } else if (form.assetType === 'crypto') {
      payload = { assetType: 'crypto', cryptoType: form.cryptoType, ...shared }
    } else if (form.assetType === 'forex') {
      payload = { assetType: 'forex', forexType: form.forexType, ...shared }
    } else if (form.assetType === 'stock') {
      payload = {
        assetType: 'stock',
        stockCode: form.stockCode,
        stockName: form.stockName,
        ...shared,
      }
    } else {
      payload = {
        assetType: 'fund',
        fundCode: form.fundCode,
        fundName: form.fundName,
        ...shared,
      }
    }

    onSubmit(payload)

    setError('')
    setForm(emptyFormState(form.assetType))
  }

  function handleCancel() {
    setForm(emptyFormState('gold'))
    setError('')
    onCancelEdit()
  }

  return (
    <form className="investment-form" onSubmit={handleSubmit}>
      <div className="field-row">
        <label>
          Varlık Türü
          <select
            value={form.assetType}
            onChange={(e) => setForm(emptyFormState(e.target.value as AssetType))}
          >
            <option value="gold">Altın</option>
            <option value="crypto">Kripto</option>
            <option value="forex">Döviz</option>
            <option value="stock">Hisse Senedi</option>
            <option value="fund">Fon</option>
          </select>
        </label>

        {form.assetType === 'gold' && (
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
        )}

        {form.assetType === 'crypto' && (
          <label>
            Kripto Para
            <select
              value={form.cryptoType}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  cryptoType: e.target.value as CryptoTypeId,
                }))
              }
            >
              {CRYPTO_TYPES.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        )}

        {form.assetType === 'forex' && (
          <label>
            Para Birimi
            <select
              value={form.forexType}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  forexType: e.target.value as ForexTypeId,
                }))
              }
            >
              {FOREX_TYPES.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        )}

        {form.assetType === 'stock' && stockList.status === 'loading' && (
          <label>
            Hisse
            <select disabled value="">
              <option value="">Hisseler yükleniyor…</option>
            </select>
          </label>
        )}

        {form.assetType === 'stock' && stockList.status === 'error' && (
          <label>
            Hisse
            <select disabled value="">
              <option value="">Liste alınamadı</option>
            </select>
            <p className="form-error">{stockList.message}</p>
            <button type="button" onClick={stockList.retry}>
              Tekrar Dene
            </button>
          </label>
        )}

        {form.assetType === 'stock' && stockList.status === 'ready' && (
          <label>
            Hisse
            <select
              value={form.stockCode}
              onChange={(e) => {
                const code = e.target.value
                const match = stockList.list.find(
                  (option) => option.code === code,
                )
                setForm((prev) => ({
                  ...prev,
                  stockCode: code,
                  stockName: match?.name ?? '',
                }))
              }}
            >
              <option value="" disabled>
                Seçiniz
              </option>
              {stockList.list.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.name} ({option.code})
                </option>
              ))}
            </select>
          </label>
        )}

        {form.assetType === 'fund' && fundList.status === 'loading' && (
          <label>
            Fon
            <select disabled value="">
              <option value="">Fonlar yükleniyor…</option>
            </select>
          </label>
        )}

        {form.assetType === 'fund' && fundList.status === 'error' && (
          <label>
            Fon
            <select disabled value="">
              <option value="">Liste alınamadı</option>
            </select>
            <p className="form-error">{fundList.message}</p>
            <button type="button" onClick={fundList.retry}>
              Tekrar Dene
            </button>
          </label>
        )}

        {form.assetType === 'fund' && fundList.status === 'ready' && (
          <label>
            Fon
            <select
              value={form.fundCode}
              onChange={(e) => {
                const code = e.target.value
                const match = fundList.list.find(
                  (option) => option.code === code,
                )
                setForm((prev) => ({
                  ...prev,
                  fundCode: code,
                  fundName: match?.name ?? '',
                }))
              }}
            >
              <option value="" disabled>
                Seçiniz
              </option>
              {fundList.list.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.name} ({option.code})
                </option>
              ))}
            </select>
          </label>
        )}

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
