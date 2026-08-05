import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Package,
  Tags,
  Layers,
  AlertTriangle,
  XCircle,
  Plus,
  ArrowRight,
  ArrowDownLeft,
  ArrowUpRight,
  Inbox,
  CheckCircle2,
} from 'lucide-react'
import dashboardService from '../services/dashboardService'
import inventoryService from '../services/inventoryService'
import StatCard from '../components/dashboard/StatCard'
import StatusBadge from '../components/common/StatusBadge'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import Table from '../components/common/Table'
import Button from '../components/common/Button'
import EmptyState from '../components/common/EmptyState'
import { CardSkeleton, TableSkeleton } from '../components/common/Skeleton'
import { formatCurrency, formatDate } from '../utils/formatters'

const columns = [
  { label: 'Product' },
  { label: 'Category' },
  { label: 'Qty', align: 'right' },
  { label: 'Price', align: 'right' },
  { label: 'Status' },
]

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, activityData] = await Promise.all([
          dashboardService.getStats(),
          inventoryService.getActivity({ limit: 6 }),
        ])

        setStats(statsData)
        setActivity(activityData.transactions)
      } catch {
        setStats(null)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div>
        <PageHeader title="Dashboard" description="Loading your inventory..." />

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <CardSkeleton count={5} />
        </div>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <TableSkeleton rows={6} columns={5} />
          </Card>
          <Card>
            <TableSkeleton rows={4} columns={2} />
          </Card>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div>
        <PageHeader title="Dashboard" />
        <Card className="mt-6">
          <EmptyState
            icon={AlertTriangle}
            title="Could not load dashboard"
            message="Something went wrong while fetching your statistics. Please refresh the page."
          />
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="A snapshot of everything in your inventory right now."
        action={
          <Link to="/products/new">
            <Button icon={Plus}>Add Product</Button>
          </Link>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          icon={Package}
          label="Total Products"
          value={stats.totalProducts}
          description="Items being tracked"
          tone="blue"
        />
        <StatCard
          icon={Tags}
          label="Categories"
          value={stats.totalCategories}
          description="Product groups"
          tone="slate"
        />
        <StatCard
          icon={Layers}
          label="Total Stock"
          value={stats.totalStock}
          description="Units across all items"
          tone="green"
        />
        <StatCard
          icon={AlertTriangle}
          label="Low Stock"
          value={stats.lowStock}
          description="10 units or fewer"
          tone="amber"
        />
        <StatCard
          icon={XCircle}
          label="Out of Stock"
          value={stats.outOfStock}
          description="Needs restocking"
          tone="red"
        />
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Recently added
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                The newest products in your catalogue
              </p>
            </div>

            <Link
              to="/products"
              className="flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {stats.recentProducts.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No products yet"
              message="Add your first product and it will show up here."
              action={
                <Link to="/products/new">
                  <Button icon={Plus}>Add Product</Button>
                </Link>
              }
            />
          ) : (
            <Table columns={columns} minWidth="min-w-xl">
              {stats.recentProducts.map((product) => (
                <tr
                  key={product._id}
                  className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100">
                    {product.name}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">
                    {product.category ? product.category.name : '-'}
                  </td>
                  <td className="px-5 py-3.5 text-right font-medium text-slate-900 dark:text-slate-100">
                    {product.quantity}
                  </td>
                  <td className="px-5 py-3.5 text-right text-slate-600 dark:text-slate-400">
                    {formatCurrency(product.unitPrice)}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={product.status} />
                  </td>
                </tr>
              ))}
            </Table>
          )}
        </Card>

        <Card className="overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Recent activity
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Latest stock movements
            </p>
          </div>

          {activity.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No activity yet"
              message="Stock movements will appear here."
            />
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {activity.map((entry) => (
                <li key={entry._id} className="flex items-center gap-3 px-5 py-3">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      entry.type === 'IN'
                        ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'
                        : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                    }`}
                  >
                    {entry.type === 'IN' ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                      {entry.product ? entry.product.name : 'Deleted product'}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {formatDate(entry.createdAt)}
                    </p>
                  </div>

                  <span
                    className={`text-sm font-semibold ${
                      entry.type === 'IN'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {entry.type === 'IN' ? '+' : '-'}
                    {entry.quantity}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Needs attention
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Products running low or out of stock
              </p>
            </div>

            <Link
              to="/products?status=Low+Stock"
              className="flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {stats.lowStockProducts.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="Everything is well stocked"
              message="No products are running low right now."
            />
          ) : (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {stats.lowStockProducts.map((product) => (
                <li
                  key={product._id}
                  className="flex items-center gap-4 px-5 py-3.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                      {product.name}
                    </p>
                    <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                      {product.category ? product.category.name : '-'}
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {product.quantity}
                    <span className="ml-1 font-normal text-slate-400">left</span>
                  </span>

                  <StatusBadge status={product.status} />

                  <Link to={`/products/${product._id}/edit`}>
                    <Button variant="secondary" size="sm">
                      Restock
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Quick actions
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Common tasks
            </p>
          </div>

          <div className="flex flex-col gap-2 p-4">
            <Link to="/products/new">
              <Button icon={Plus} className="w-full justify-start">
                Add Product
              </Button>
            </Link>

            <Link to="/categories">
              <Button
                variant="secondary"
                icon={Tags}
                className="w-full justify-start"
              >
                Manage Categories
              </Button>
            </Link>

            <Link to="/inventory">
              <Button
                variant="secondary"
                icon={Layers}
                className="w-full justify-start"
              >
                View Stock Activity
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
