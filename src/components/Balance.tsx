import type { Transaction } from '../types'
import { computeBalanceSummary } from '../utils/balance'
import { formatCurrency } from '../utils/format'

interface BalanceProps {
  transactions: Transaction[]
}

export function Balance({ transactions }: BalanceProps) {
  const { totalIncome, totalExpense, net } = computeBalanceSummary(transactions)

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
