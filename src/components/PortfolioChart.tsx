import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { Investment, Transaction } from '../types'
import { computeBalanceSummary } from '../utils/balance'
import { formatCurrency } from '../utils/format'
import { investmentLabel } from '../utils/investmentLabel'
import { useThemeColors } from '../hooks/useThemeColors'

interface PortfolioChartProps {
  investments: Investment[]
  transactions: Transaction[]
}

const MAX_SLICES = 7 // Nakit + en büyük 6 ürün; kalanı "Diğer"e katlanır

function productKey(investment: Investment): string {
  if (investment.assetType === 'gold') return `gold:${investment.goldType}`
  if (investment.assetType === 'crypto') return `crypto:${investment.cryptoType}`
  if (investment.assetType === 'forex') return `forex:${investment.forexType}`
  if (investment.assetType === 'stock') return `stock:${investment.stockCode}`
  return `fund:${investment.fundCode}`
}

export function PortfolioChart({ investments, transactions }: PortfolioChartProps) {
  const colors = useThemeColors()

  const { net } = computeBalanceSummary(transactions)
  const cash = Math.max(0, net)

  const productTotals = new Map<string, { name: string; value: number }>()
  for (const investment of investments) {
    const key = productKey(investment)
    const value = investment.quantity * investment.currentPrice
    const existing = productTotals.get(key)
    if (existing) {
      existing.value += value
    } else {
      productTotals.set(key, { name: investmentLabel(investment), value })
    }
  }

  const entries = [...productTotals.values()].filter((entry) => entry.value > 0)
  if (cash > 0) {
    entries.push({ name: 'Nakit', value: cash })
  }

  if (entries.length === 0) {
    return <p className="empty-state">Henüz gösterilecek veri yok.</p>
  }

  const cashEntry = entries.find((entry) => entry.name === 'Nakit')
  const productEntries = entries.filter((entry) => entry.name !== 'Nakit')

  let shown = productEntries
  let other: { name: string; value: number } | null = null
  const maxProducts = cashEntry ? MAX_SLICES - 1 : MAX_SLICES
  if (productEntries.length > maxProducts) {
    const sortedByValue = [...productEntries].sort((a, b) => b.value - a.value)
    shown = sortedByValue.slice(0, maxProducts - 1)
    const rest = sortedByValue.slice(maxProducts - 1)
    other = { name: 'Diğer', value: rest.reduce((sum, e) => sum + e.value, 0) }
  }

  // Renk kararlılığı: sıralama fiyata/değere göre değil, isme göre (alfabetik) —
  // böylece dilim renkleri değerler dalgalandıkça yer değiştirmez.
  const sortedShown = [...shown].sort((a, b) => a.name.localeCompare(b.name, 'tr'))

  const palette = [
    colors['--cat-2'],
    colors['--cat-3'],
    colors['--cat-4'],
    colors['--cat-5'],
    colors['--cat-6'],
    colors['--cat-7'],
  ]

  const data = [
    ...(cashEntry ? [{ ...cashEntry, color: colors['--cat-1'] }] : []),
    ...sortedShown.map((entry, index) => ({ ...entry, color: palette[index] })),
    ...(other ? [{ ...other, color: colors['--cat-8'] }] : []),
  ]

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={110}
          stroke={colors['--bg']}
          strokeWidth={2}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => formatCurrency(Number(value))}
          contentStyle={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            fontSize: 13,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 13, color: colors['--text'] }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
