import { useState } from 'react'
import type { FormEvent } from 'react'
import type { AssetType, PriceSourceConfig, PriceSources } from '../types'

interface PriceSourceSettingsProps {
  priceSources: PriceSources
  onSet: (assetType: AssetType, config: PriceSourceConfig) => void
  onDelete: (assetType: AssetType) => void
}

const GENERIC_ASSET_TYPES: { value: AssetType; label: string }[] = [
  { value: 'gold', label: 'Altın' },
  { value: 'stock', label: 'Hisse Senedi' },
  { value: 'fund', label: 'Fon' },
  { value: 'other', label: 'Diğer' },
]

export function PriceSourceSettings({
  priceSources,
  onSet,
  onDelete,
}: PriceSourceSettingsProps) {
  const [assetType, setAssetType] = useState<AssetType>('gold')
  const [urlTemplate, setUrlTemplate] = useState('')
  const [jsonPath, setJsonPath] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmedUrl = urlTemplate.trim()
    const trimmedPath = jsonPath.trim()

    if (!trimmedUrl.includes('{symbol}')) {
      setError("URL şablonu {symbol} yer tutucusu içermeli.")
      return
    }
    if (!trimmedPath) {
      setError('Lütfen bir JSON yolu girin.')
      return
    }

    onSet(assetType, { urlTemplate: trimmedUrl, jsonPath: trimmedPath })
    setUrlTemplate('')
    setJsonPath('')
    setError('')
  }

  const configuredEntries = GENERIC_ASSET_TYPES.filter(
    (option) => priceSources[option.value],
  )

  return (
    <div className="price-source-settings">
      <p className="price-source-caveat">
        API anahtarınızı URL içine ekleyebilirsiniz; bu anahtar tarayıcınızın
        ağ isteklerinde görünür olur. Bu, yalnızca kişisel kullanım için tek
        kişilik bu araçta bir risk oluşturmaz, ancak URL'yi kimseyle
        paylaşmayın.
      </p>

      <form className="price-source-form" onSubmit={handleSubmit}>
        <select
          value={assetType}
          onChange={(e) => setAssetType(e.target.value as AssetType)}
        >
          {GENERIC_ASSET_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={urlTemplate}
          onChange={(e) => setUrlTemplate(e.target.value)}
          placeholder="https://example.com/price?symbol={symbol}&apikey=XXXX"
        />
        <input
          type="text"
          value={jsonPath}
          onChange={(e) => setJsonPath(e.target.value)}
          placeholder="price veya data.0.value"
        />
        <button type="submit" className="primary">
          Kaydet
        </button>
      </form>
      {error && <p className="form-error">{error}</p>}

      {configuredEntries.length === 0 ? (
        <p className="empty-state">Henüz fiyat kaynağı yapılandırılmadı.</p>
      ) : (
        <ul className="price-source-list">
          {configuredEntries.map((option) => {
            const config = priceSources[option.value]
            if (!config) return null
            return (
              <li key={option.value} className="price-source-item">
                <span className="price-source-type">{option.label}</span>
                <span className="price-source-url">{config.urlTemplate}</span>
                <span className="price-source-path">{config.jsonPath}</span>
                <button type="button" onClick={() => onDelete(option.value)}>
                  Sil
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
