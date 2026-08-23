function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function getMonthRange(offsetMonths: number): {
  start: string
  end: string
} {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() + offsetMonths, 1)
  const end = new Date(now.getFullYear(), now.getMonth() + offsetMonths + 1, 0)
  return { start: toISODate(start), end: toISODate(end) }
}
