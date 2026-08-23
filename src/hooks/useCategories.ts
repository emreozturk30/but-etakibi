import { useEffect, useState } from 'react'
import type { Category, TransactionType } from '../types'
import { DEFAULT_CATEGORIES } from '../constants/categories'
import { loadCustomCategories, saveCustomCategories } from '../utils/storage'

export function useCategories() {
  const [customCategories, setCustomCategories] = useState<Category[]>(() =>
    loadCustomCategories(),
  )

  useEffect(() => {
    saveCustomCategories(customCategories)
  }, [customCategories])

  const categories = [...DEFAULT_CATEGORIES, ...customCategories]

  function addCategory(name: string, type: TransactionType) {
    setCustomCategories((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name, type },
    ])
  }

  function renameCategory(id: string, name: string) {
    setCustomCategories((prev) =>
      prev.map((category) =>
        category.id === id ? { ...category, name } : category,
      ),
    )
  }

  function deleteCategory(id: string) {
    setCustomCategories((prev) =>
      prev.filter((category) => category.id !== id),
    )
  }

  return {
    categories,
    customCategories,
    addCategory,
    renameCategory,
    deleteCategory,
  }
}
