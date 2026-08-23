import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Category, Transaction } from '../types'
import { getCategoryById } from '../utils/categoryHelpers'
import { formatCurrency } from '../utils/format'
import { useThemeColors } from '../hooks/useThemeColors'

interface CategoryBreakdownChartProps {
  categories: Category[]
  transactions: Transaction[]
}

export function CategoryBreakdownChart({
  categories,
  transactions,
}: CategoryBreakdownChartProps) {
  const colors = useThemeColors()

  const totals = new Map<string, number>()
  for (const transaction of transactions) {
    if (transaction.type !== 'expense') continue
    totals.set(
      transaction.categoryId,
      (totals.get(transaction.categoryId) ?? 0) + transaction.amount,
    )
  }

  const data = [...totals.entries()]
    .map(([categoryId, amount]) => ({
      name: getCategoryById(categories, categoryId)?.name ?? 'Diğer',
      amount,
    }))
    .sort((a, b) => b.amount - a.amount)

  if (data.length === 0) {
    return <p className="empty-state">Gösterilecek gider verisi yok.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(data.length * 36, 100)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 56, left: 8, bottom: 4 }}
      >
        <CartesianGrid horizontal={false} stroke={colors['--chart-grid']} />
        <XAxis
          type="number"
          tick={{ fill: colors['--chart-muted'], fontSize: 12 }}
          axisLine={{ stroke: colors['--chart-grid'] }}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={110}
          tick={{ fill: colors['--text'], fontSize: 12 }}
          axisLine={{ stroke: colors['--chart-grid'] }}
          tickLine={false}
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
        <Bar
          dataKey="amount"
          fill={colors['--chart-blue']}
          radius={[0, 4, 4, 0]}
          barSize={20}
        >
          <LabelList
            dataKey="amount"
            position="right"
            formatter={(value) => formatCurrency(Number(value))}
            fill={colors['--text']}
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
