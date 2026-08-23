import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Transaction } from '../types'
import { formatCompactCurrency, formatCurrency } from '../utils/format'
import { useThemeColors } from '../hooks/useThemeColors'

interface MonthlyTrendChartProps {
  transactions: Transaction[]
}

const MONTHS_SHOWN = 6

function monthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number)
  const date = new Date(year, month - 1, 1)
  return new Intl.DateTimeFormat('tr-TR', {
    month: 'short',
    year: '2-digit',
  }).format(date)
}

export function MonthlyTrendChart({ transactions }: MonthlyTrendChartProps) {
  const colors = useThemeColors()

  const totals = new Map<string, { income: number; expense: number }>()
  for (const transaction of transactions) {
    const monthKey = transaction.date.slice(0, 7)
    const entry = totals.get(monthKey) ?? { income: 0, expense: 0 }
    entry[transaction.type] += transaction.amount
    totals.set(monthKey, entry)
  }

  const data = [...totals.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-MONTHS_SHOWN)
    .map(([monthKey, values]) => ({
      month: monthLabel(monthKey),
      Gelir: values.income,
      Gider: values.expense,
    }))

  if (data.length === 0) {
    return <p className="empty-state">Gösterilecek trend verisi yok.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
        <CartesianGrid vertical={false} stroke={colors['--chart-grid']} />
        <XAxis
          dataKey="month"
          tick={{ fill: colors['--chart-muted'], fontSize: 12 }}
          axisLine={{ stroke: colors['--chart-grid'] }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: colors['--chart-muted'], fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={64}
          tickFormatter={(value: number) => formatCompactCurrency(value)}
        />
        <Tooltip
          formatter={(value) => formatCurrency(Number(value))}
          contentStyle={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            fontSize: 13,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: colors['--text'] }} />
        <Bar
          dataKey="Gelir"
          fill={colors['--chart-income']}
          radius={[4, 4, 0, 0]}
          barSize={20}
        />
        <Bar
          dataKey="Gider"
          fill={colors['--chart-expense']}
          radius={[4, 4, 0, 0]}
          barSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
