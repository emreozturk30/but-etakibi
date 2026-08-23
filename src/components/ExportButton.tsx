import type { Category, Transaction } from '../types'
import { downloadCsv, transactionsToCsv } from '../utils/csv'

interface ExportButtonProps {
  categories: Category[]
  transactions: Transaction[]
}

function todayForFilename(): string {
  return new Date().toISOString().slice(0, 10)
}

export function ExportButton({ categories, transactions }: ExportButtonProps) {
  function handleExport() {
    const csv = transactionsToCsv(transactions, categories)
    downloadCsv(`but-etakibi-islemler-${todayForFilename()}.csv`, csv)
  }

  return (
    <div className="export-section">
      <p>
        {transactions.length === 0
          ? 'Uygulanan filtrelere göre dışa aktarılacak işlem yok.'
          : `${transactions.length} işlem, uygulanan filtrelere göre dışa aktarılacak.`}
      </p>
      <button
        type="button"
        className="primary"
        onClick={handleExport}
        disabled={transactions.length === 0}
      >
        CSV Olarak İndir
      </button>
    </div>
  )
}
