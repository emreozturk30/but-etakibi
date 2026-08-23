import type { Transaction } from '../types'
import { formatCurrency } from '../utils/format'

interface BalanceProps {
  transactions: Transaction[]
}

export function Balance({ transactions }: BalanceProps) {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const net = totalIncome - totalExpense

  return (
    <div className="balance">
      <div className="balance-item">
        <span className="balance-label">Gelir</span>
        <span className="balance-value income">
          {formatCurrency(totalIncome)}
        </span>
      </div>
      <div className="balance-item">
        <span className="balance-label">Gider</span>
        <span className="balance-value expense">
          {formatCurrency(totalExpense)}
        </span>
      </div>
      <div className="balance-item">
        <span className="balance-label">Bakiye</span>
        <span className={`balance-value ${net >= 0 ? 'income' : 'expense'}`}>
          {formatCurrency(net)}
        </span>
      </div>
    </div>
  )
}
