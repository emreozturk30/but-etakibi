import type { Category, TransactionType } from '../types'

export function getCategoriesByType(
  categories: Category[],
  type: TransactionType,
): Category[] {
  return categories.filter((category) => category.type === type)
}

export function getCategoryById(
  categories: Category[],
  id: string,
): Category | undefined {
  return categories.find((category) => category.id === id)
}
