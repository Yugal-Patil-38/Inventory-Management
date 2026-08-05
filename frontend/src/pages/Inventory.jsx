import { useState, useEffect } from 'react'
import { ArrowDownLeft, ArrowUpRight, Inbox } from 'lucide-react'
import inventoryService from '../services/inventoryService'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import Table from '../components/common/Table'
import Badge from '../components/common/Badge'
import Pagination from '../components/common/Pagination'
import EmptyState from '../components/common/EmptyState'
import { TableSkeleton } from '../components/common/Skeleton'
import { formatDate } from '../utils/formatters'

const columns = [
  { label: 'Type' },
  { label: 'Product' },
  { label: 'Quantity', align: 'right' },
  { label: 'Stock change', align: 'right' },
  { label: 'Note' },
  { label: 'By' },
  { label: 'Date' },
]

function Inventory() {
  const [transactions, setTransactions] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadActivity = async () => {
      setLoading(true)

      try {
        const data = await inventoryService.getActivity({ page })
        setTransactions(data.transactions)
        setTotalPages(data.totalPages)
        setTotalTransactions(data.totalTransactions)
      } catch {
        setTransactions([])
      } finally {
        setLoading(false)
      }
    }

    loadActivity()
  }, [page])

  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Every stock movement recorded across your products."
      />

      <Card className="mt-6 overflow-hidden">
        {loading ? (
          <TableSkeleton rows={8} columns={6} />
        ) : transactions.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No stock movements yet"
            message="Use the stock button on any product to record your first movement."
          />
        ) : (
          <>
            <Table columns={columns} minWidth="min-w-4xl">
              {transactions.map((entry) => (
                <tr
                  key={entry._id}
                  className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="px-5 py-3.5">
                    <Badge tone={entry.type === 'IN' ? 'green' : 'red'}>
                      {entry.type === 'IN' ? (
                        <ArrowDownLeft className="h-3 w-3" />
                      ) : (
                        <ArrowUpRight className="h-3 w-3" />
                      )}
                      {entry.type === 'IN' ? 'Stock In' : 'Stock Out'}
                    </Badge>
                  </td>

                  <td className="px-5 py-3.5">
                    {entry.product ? (
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {entry.product.name}
                        </p>
                        <p className="font-mono text-xs text-slate-400 dark:text-slate-500">
                          {entry.product.sku}
                        </p>
                      </div>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500">
                        Deleted product
                      </span>
                    )}
                  </td>

                  <td
                    className={`px-5 py-3.5 text-right font-semibold ${
                      entry.type === 'IN'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {entry.type === 'IN' ? '+' : '-'}
                    {entry.quantity}
                  </td>

                  <td className="px-5 py-3.5 text-right text-slate-500 dark:text-slate-400">
                    {entry.previousQuantity} &rarr;{' '}
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {entry.newQuantity}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">
                    {entry.note || (
                      <span className="text-slate-300 dark:text-slate-600">—</span>
                    )}
                  </td>

                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">
                    {entry.createdBy ? entry.createdBy.name : '-'}
                  </td>

                  <td className="whitespace-nowrap px-5 py-3.5 text-slate-500 dark:text-slate-400">
                    {formatDate(entry.createdAt)}
                  </td>
                </tr>
              ))}
            </Table>

            <Pagination
              page={page}
              totalPages={totalPages}
              totalItems={totalTransactions}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>
    </div>
  )
}

export default Inventory
