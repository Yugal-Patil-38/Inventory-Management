import { useState, useEffect } from 'react'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import Modal from '../common/Modal'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import inventoryService from '../../services/inventoryService'
import { formatDate } from '../../utils/formatters'

const typeOptions = [
  { value: 'IN', label: 'Stock In' },
  { value: 'OUT', label: 'Stock Out' },
]

function StockModal({ product, onClose, onSaved }) {
  const [form, setForm] = useState({ type: 'IN', quantity: 1, note: '' })
  const [history, setHistory] = useState([])
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await inventoryService.getHistory(product._id)
        setHistory(data)
      } catch {
        setHistory([])
      }
    }

    loadHistory()
  }, [product._id])

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await inventoryService.adjustStock(product._id, {
        type: form.type,
        quantity: Number(form.quantity),
        note: form.note,
      })

      onSaved()
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update stock')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      title="Update stock"
      description="Record a stock movement for this product."
      onClose={onClose}
      size="lg"
    >
      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
            {product.name}
          </p>
          <p className="font-mono text-xs text-slate-400 dark:text-slate-500">
            {product.sku}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Current stock
          </p>
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {product.quantity}
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Movement type"
            value={form.type}
            onChange={(value) => setForm({ ...form, type: value })}
            options={typeOptions}
            required
          />

          <Input
            label="Quantity"
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            min={1}
            required
          />
        </div>

        <Input
          label="Note"
          type="text"
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="e.g. Received from supplier"
          className="mt-4"
        />

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>

          <Button type="submit" loading={isSubmitting}>
            {isSubmitting ? 'Saving' : 'Update stock'}
          </Button>
        </div>
      </form>

      {history.length > 0 && (
        <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Recent movements
          </p>

          <ul className="mt-3 flex flex-col gap-2.5">
            {history.slice(0, 5).map((entry) => (
              <li key={entry._id} className="flex items-center gap-3 text-sm">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                    entry.type === 'IN'
                      ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'
                      : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                  }`}
                >
                  {entry.type === 'IN' ? (
                    <ArrowDownLeft className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  )}
                </span>

                <span
                  className={`font-medium ${
                    entry.type === 'IN'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {entry.type === 'IN' ? '+' : '-'}
                  {entry.quantity}
                </span>

                <span className="text-slate-400 dark:text-slate-500">
                  {entry.previousQuantity} &rarr; {entry.newQuantity}
                </span>

                <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">
                  {formatDate(entry.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Modal>
  )
}

export default StockModal
