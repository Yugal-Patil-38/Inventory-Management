import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  ArrowLeft,
  Pencil,
  Trash2,
  ArrowLeftRight,
  Package,
  ArrowDownLeft,
  ArrowUpRight,
  Inbox,
} from 'lucide-react'
import productService from '../services/productService'
import inventoryService from '../services/inventoryService'
import { AuthContext } from '../context/AuthContext'
import StockModal from '../components/products/StockModal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import StatusBadge from '../components/common/StatusBadge'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Table from '../components/common/Table'
import Badge from '../components/common/Badge'
import EmptyState from '../components/common/EmptyState'
import { Skeleton } from '../components/common/Skeleton'
import { formatCurrency, formatDateTime } from '../utils/formatters'

const historyColumns = [
  { label: 'Type' },
  { label: 'Quantity', align: 'right' },
  { label: 'Stock change', align: 'right' },
  { label: 'Note' },
  { label: 'Date' },
]

function DetailRow({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <dt className="text-sm text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="text-right text-sm font-medium text-slate-900 dark:text-slate-100">
        {children}
      </dd>
    </div>
  )
}

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const [product, setProduct] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [isStockOpen, setIsStockOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadProduct = async () => {
    try {
      const [productData, historyData] = await Promise.all([
        productService.getProductById(id),
        inventoryService.getHistory(id),
      ])

      setProduct(productData)
      setHistory(historyData)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to load product')
      setProduct(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProduct()
  }, [id])

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      await productService.deleteProduct(id)
      toast.success('Product deleted')
      navigate('/products')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to delete product')
      setIsDeleteOpen(false)
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <Skeleton className="h-6 w-48" />
          <div className="mt-6 flex flex-col gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-full" />
            ))}
          </div>
        </Card>
        <Card className="h-fit p-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-4 h-16 w-full" />
        </Card>
      </div>
    )
  }

  if (!product) {
    return (
      <Card>
        <EmptyState
          icon={Package}
          title="Product not found"
          message="This product may have been deleted or the link is incorrect."
          action={
            <Link to="/products">
              <Button icon={ArrowLeft}>Back to products</Button>
            </Link>
          }
        />
      </Card>
    )
  }

  const totalValue = product.quantity * product.unitPrice

  return (
    <div>
      <Link
        to="/products"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
            <Package className="h-6 w-6 text-slate-400" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {product.name}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                {product.sku}
              </span>
              <StatusBadge status={product.status} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            icon={ArrowLeftRight}
            onClick={() => setIsStockOpen(true)}
          >
            Update stock
          </Button>

          <Link to={`/products/${product._id}/edit`}>
            <Button variant="secondary" icon={Pencil}>
              Edit
            </Button>
          </Link>

          {user?.role === 'admin' && (
            <Button
              variant="danger"
              icon={Trash2}
              onClick={() => setIsDeleteOpen(true)}
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Product information
          </h2>

          <dl className="mt-2 divide-y divide-slate-100 dark:divide-slate-800">
            <DetailRow label="Product name">{product.name}</DetailRow>
            <DetailRow label="SKU">
              <span className="font-mono">{product.sku}</span>
            </DetailRow>
            <DetailRow label="Category">
              {product.category ? product.category.name : '—'}
            </DetailRow>
            <DetailRow label="Supplier">{product.supplier || '—'}</DetailRow>
            <DetailRow label="Unit price">
              {formatCurrency(product.unitPrice)}
            </DetailRow>
            <DetailRow label="Quantity in stock">{product.quantity}</DetailRow>
            <DetailRow label="Status">
              <StatusBadge status={product.status} />
            </DetailRow>
            <DetailRow label="Date added">
              {formatDateTime(product.createdAt)}
            </DetailRow>
            <DetailRow label="Last updated">
              {formatDateTime(product.updatedAt)}
            </DetailRow>
          </dl>

          <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Description
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {product.description || 'No description provided.'}
            </p>
          </div>
        </Card>

        <Card className="h-fit p-6">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Stock summary
          </h2>

          <div className="mt-5 rounded-lg bg-slate-50 p-4 text-center dark:bg-slate-800/50">
            <p className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {product.quantity}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              units in stock
            </p>
          </div>

          <dl className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            <DetailRow label="Unit price">
              {formatCurrency(product.unitPrice)}
            </DetailRow>
            <DetailRow label="Total value">
              {formatCurrency(totalValue)}
            </DetailRow>
            <DetailRow label="Movements">{history.length}</DetailRow>
          </dl>
        </Card>
      </div>

      <Card className="mt-6">
        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Stock history
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            The last 10 movements for this product
          </p>
        </div>

        {history.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No stock movements yet"
            message="Use Update stock to record the first movement for this product."
          />
        ) : (
          <Table columns={historyColumns} minWidth="min-w-2xl">
            {history.map((entry) => (
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

                <td className="whitespace-nowrap px-5 py-3.5 text-slate-500 dark:text-slate-400">
                  {formatDateTime(entry.createdAt)}
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {isStockOpen && (
        <StockModal
          product={product}
          onClose={() => setIsStockOpen(false)}
          onSaved={() => {
            setIsStockOpen(false)
            toast.success('Stock updated')
            loadProduct()
          }}
        />
      )}

      {isDeleteOpen && (
        <ConfirmDialog
          title="Delete product"
          message={`"${product.name}" will be permanently removed from your inventory. This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteOpen(false)}
          isBusy={isDeleting}
        />
      )}
    </div>
  )
}

export default ProductDetails
