import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Package, Pencil, Trash2, ArrowLeftRight, Eye } from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'
import Table from '../common/Table'
import Button from '../common/Button'
import StatusBadge from '../common/StatusBadge'
import { formatCurrency } from '../../utils/formatters'

const columns = [
  { label: 'Product' },
  { label: 'SKU' },
  { label: 'Category' },
  { label: 'Price', align: 'right' },
  { label: 'Quantity', align: 'right' },
  { label: 'Status' },
  { label: '', align: 'right' },
]

function ProductTable({ products, onStock, onDelete }) {
  const { user } = useContext(AuthContext)

  return (
    <Table columns={columns} minWidth="min-w-4xl">
      {products.map((product) => (
        <tr
          key={product._id}
          className="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
        >
          <td className="px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                <Package className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </div>

              <div className="min-w-0">
                <Link
                  to={`/products/${product._id}`}
                  className="block truncate font-medium text-slate-900 transition-colors hover:text-brand-800 dark:text-slate-100 dark:hover:text-brand-300"
                >
                  {product.name}
                </Link>
                {product.supplier && (
                  <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                    {product.supplier}
                  </p>
                )}
              </div>
            </div>
          </td>

          <td className="px-5 py-3.5">
            <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              {product.sku}
            </span>
          </td>

          <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">
            {product.category ? product.category.name : '-'}
          </td>

          <td className="px-5 py-3.5 text-right text-slate-600 dark:text-slate-400">
            {formatCurrency(product.unitPrice)}
          </td>

          <td className="px-5 py-3.5 text-right font-medium text-slate-900 dark:text-slate-100">
            {product.quantity}
          </td>

          <td className="px-5 py-3.5">
            <StatusBadge status={product.status} />
          </td>

          <td className="px-5 py-3.5">
            <div className="flex justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
              <Link
                to={`/products/${product._id}`}
                title="View details"
                className="inline-flex h-8 items-center justify-center rounded-lg px-3 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              >
                <Eye className="h-4 w-4" />
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onStock(product)}
                title="Update stock"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>

              <Link
                to={`/products/${product._id}/edit`}
                title="Edit product"
                className="inline-flex h-8 items-center justify-center rounded-lg px-3 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              >
                <Pencil className="h-4 w-4" />
              </Link>

              {user?.role === 'admin' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(product)}
                  title="Delete product"
                  className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </td>
        </tr>
      ))}
    </Table>
  )
}

export default ProductTable
