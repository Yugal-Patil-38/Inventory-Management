import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Plus, Package, SearchX } from 'lucide-react'
import productService from '../services/productService'
import categoryService from '../services/categoryService'
import ProductTable from '../components/products/ProductTable'
import ProductFilters from '../components/products/ProductFilters'
import StockModal from '../components/products/StockModal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import Pagination from '../components/common/Pagination'
import PageHeader from '../components/common/PageHeader'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import EmptyState from '../components/common/EmptyState'
import { TableSkeleton } from '../components/common/Skeleton'

function Products() {
  const [searchParams] = useSearchParams()

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: '',
    status: searchParams.get('status') || '',
    sortBy: 'createdAt',
    order: 'desc',
  })

  const [stockProduct, setStockProduct] = useState(null)
  const [deletingProduct, setDeletingProduct] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getCategories()
        setCategories(data)
      } catch {
        setCategories([])
      }
    }

    loadCategories()
  }, [])

  const loadProducts = async () => {
    setLoading(true)

    try {
      const data = await productService.getProducts({ ...filters, page })
      setProducts(data.products)
      setTotalPages(data.totalPages)
      setTotalProducts(data.totalProducts)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts()
    }, 400)

    return () => clearTimeout(timer)
  }, [filters, page])

  const handleFilterChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value })
    setPage(1)
  }

  const handleSortChange = (event) => {
    const [sortBy, order] = event.target.value.split('-')
    setFilters({ ...filters, sortBy, order })
    setPage(1)
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      await productService.deleteProduct(deletingProduct._id)
      toast.success('Product deleted')
      setDeletingProduct(null)
      loadProducts()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to delete product')
      setDeletingProduct(null)
    } finally {
      setIsDeleting(false)
    }
  }

  const hasFilters =
    filters.search !== '' || filters.category !== '' || filters.status !== ''

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage every item in your inventory."
        action={
          <Link to="/products/new">
            <Button icon={Plus}>Add Product</Button>
          </Link>
        }
      />

      <Card className="mt-6 overflow-hidden">
        <ProductFilters
          filters={filters}
          categories={categories}
          onChange={handleFilterChange}
          onSortChange={handleSortChange}
        />

        {loading ? (
          <TableSkeleton rows={6} columns={6} />
        ) : products.length === 0 ? (
          <EmptyState
            icon={hasFilters ? SearchX : Package}
            title={hasFilters ? 'No matching products' : 'No products yet'}
            message={
              hasFilters
                ? 'Try adjusting your search or filters to find what you are looking for.'
                : 'Add your first product to start tracking stock levels.'
            }
            action={
              hasFilters ? (
                <Button
                  variant="secondary"
                  onClick={() =>
                    setFilters({ ...filters, search: '', category: '', status: '' })
                  }
                >
                  Clear filters
                </Button>
              ) : (
                <Link to="/products/new">
                  <Button icon={Plus}>Add Product</Button>
                </Link>
              )
            }
          />
        ) : (
          <>
            <ProductTable
              products={products}
              onStock={setStockProduct}
              onDelete={setDeletingProduct}
            />

            <Pagination
              page={page}
              totalPages={totalPages}
              totalItems={totalProducts}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>

      {stockProduct && (
        <StockModal
          product={stockProduct}
          onClose={() => setStockProduct(null)}
          onSaved={() => {
            setStockProduct(null)
            toast.success('Stock updated')
            loadProducts()
          }}
        />
      )}

      {deletingProduct && (
        <ConfirmDialog
          title="Delete product"
          message={`"${deletingProduct.name}" will be permanently removed from your inventory. This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingProduct(null)}
          isBusy={isDeleting}
        />
      )}
    </div>
  )
}

export default Products
