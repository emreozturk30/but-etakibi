import { useState } from 'react'
import type { KeyboardEvent } from 'react'

export interface SearchableSelectOption {
  id: string
  label: string
}

interface SearchableSelectProps {
  options: SearchableSelectOption[]
  value: string
  onChange: (id: string) => void
  placeholder?: string
}

const MAX_VISIBLE_OPTIONS = 50

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
}: SearchableSelectProps) {
  const selectedLabel = options.find((option) => option.id === value)?.label ?? ''
  const [query, setQuery] = useState(selectedLabel)
  const [open, setOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const [lastSelectedLabel, setLastSelectedLabel] = useState(selectedLabel)

  if (selectedLabel !== lastSelectedLabel) {
    setLastSelectedLabel(selectedLabel)
    setQuery(selectedLabel)
  }

  const trimmedQuery = query.trim().toLocaleLowerCase('tr')
  const filtered = trimmedQuery
    ? options.filter((option) =>
        option.label.toLocaleLowerCase('tr').includes(trimmedQuery),
      )
    : options
  const visible = filtered.slice(0, MAX_VISIBLE_OPTIONS)

  function selectOption(option: SearchableSelectOption) {
    onChange(option.id)
    setQuery(option.label)
    setOpen(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open) {
      if (event.key === 'ArrowDown' || event.key === 'Enter') {
        event.preventDefault()
        setOpen(true)
        setHighlightedIndex(0)
      }
      return
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlightedIndex((index) => Math.min(index + 1, visible.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlightedIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const option = visible[highlightedIndex]
      if (option) selectOption(option)
    } else if (event.key === 'Escape') {
      setOpen(false)
      setQuery(selectedLabel)
    }
  }

  return (
    <div className="searchable-select">
      <input
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        autoComplete="off"
        value={query}
        placeholder={placeholder}
        onFocus={() => {
          setOpen(true)
          setHighlightedIndex(0)
        }}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
          setHighlightedIndex(0)
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          setOpen(false)
          setQuery(selectedLabel)
        }}
      />
      {open && (
        <ul className="searchable-select-options" role="listbox">
          {visible.length === 0 && (
            <li className="searchable-select-empty">Sonuç bulunamadı</li>
          )}
          {visible.map((option, index) => (
            <li
              key={option.id}
              role="option"
              aria-selected={option.id === value}
              className={index === highlightedIndex ? 'highlighted' : ''}
              onMouseDown={(e) => {
                e.preventDefault()
                selectOption(option)
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
