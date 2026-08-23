import type { Category, TransactionType } from '../types'
import type { DateRangePreset, TransactionFilters } from '../types/filters'
import { getCategoriesByType } from '../utils/categoryHelpers'

interface FiltersProps {
  categories: Category[]
  filters: TransactionFilters
  onChange: (filters: TransactionFilters) => void
}

export function Filters({ categories, filters, onChange }: FiltersProps) {
  const categoryOptions =
    filters.type === 'all'
      ? categories
      : getCategoriesByType(categories, filters.type)

  function handleTypeChange(type: TransactionType | 'all') {
    onChange({ ...filters, type, categoryId: 'all' })
  }

  function handleRangeChange(rangePreset: DateRangePreset) {
    onChange({ ...filters, rangePreset })
  }

  return (
    <div className="filters">
      <label>
        Tür
        <select
          value={filters.type}
          onChange={(e) =>
            handleTypeChange(e.target.value as TransactionType | 'all')
          }
        >
          <option value="all">Tümü</option>
          <option value="income">Gelir</option>
          <option value="expense">Gider</option>
        </select>
      </label>

      <label>
        Kategori
        <select
          value={filters.categoryId}
          onChange={(e) => onChange({ ...filters, categoryId: e.target.value })}
        >
          <option value="all">Tümü</option>
          {categoryOptions.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Tarih Aralığı
        <select
          value={filters.rangePreset}
          onChange={(e) =>
            handleRangeChange(e.target.value as DateRangePreset)
          }
        >
          <option value="all">Tümü</option>
          <option value="this-month">Bu Ay</option>
          <option value="last-month">Geçen Ay</option>
          <option value="custom">Özel Aralık</option>
        </select>
      </label>

      {filters.rangePreset === 'custom' && (
        <>
          <label>
            Başlangıç
            <input
              type="date"
              value={filters.customStart}
              onChange={(e) =>
                onChange({ ...filters, customStart: e.target.value })
              }
            />
          </label>
          <label>
            Bitiş
            <input
              type="date"
              value={filters.customEnd}
              onChange={(e) =>
                onChange({ ...filters, customEnd: e.target.value })
              }
            />
          </label>
        </>
      )}
    </div>
  )
}
