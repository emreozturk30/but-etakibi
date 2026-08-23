import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Transaction } from '../types'
import { formatCompactCurrency, formatCurrency } from '../utils/format'
import { useThemeColors } from '../hooks/useThemeColors'

interface CumulativeBalanceChartProps {
  transactions: Transaction[]
}

function monthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number)
  const date = new Date(year, month - 1, 1)
  return new Intl.DateTimeFormat('tr-TR', {
    month: 'short',
    year: '2-digit',
  }).format(date)
}

export function CumulativeBalanceChart({
  transactions,
}: CumulativeBalanceChartProps) {
  const colors = useThemeColors()

  const monthlyNet = new Map<string, number>()
  for (const transaction of transactions) {
    const monthKey = transaction.date.slice(0, 7)
    const signedAmount =
      transaction.type === 'income' ? transaction.amount : -transaction.amount
    monthlyNet.set(monthKey, (monthlyNet.get(monthKey) ?? 0) + signedAmount)
  }

  const data = [...monthlyNet.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .reduce<{ month: string; Birikim: number }[]>((acc, [monthKey, net]) => {
      const previousTotal = acc.at(-1)?.Birikim ?? 0
      acc.push({ month: monthLabel(monthKey), Birikim: previousTotal + net })
      return acc
    }, [])

  if (data.length === 0) {
    return <p className="empty-state">Gösterilecek birikim verisi yok.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
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
        <ReferenceLine y={0} stroke={colors['--chart-muted']} />
        <Tooltip
          formatter={(value) => formatCurrency(Number(value))}
          contentStyle={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            fontSize: 13,
          }}
        />
        <Area
          type="monotone"
          dataKey="Birikim"
          stroke={colors['--chart-blue']}
          strokeWidth={2}
          fill={colors['--chart-blue']}
          fillOpacity={0.1}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
