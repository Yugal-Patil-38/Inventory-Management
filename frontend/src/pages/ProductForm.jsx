import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, Info } from 'lucide-react'
import productService from '../services/productService'
import categoryService from '../services/categoryService'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import Button from '../components/common/Button'
import { Skeleton } from '../components/common/Skeleton'

function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: '',
    description: '',
    quantity: 0,
    unitPrice: 0,
    supplier: '',
  })

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoryList = await categoryService.getCategories()
        setCategories(categoryList)

        if (id) {
          const product = await productService.getProductById(id)

          setForm({
            name: product.name,
            sku: product.sku,
            category: product.category._id,
            description: product.description,
            quantity: product.quantity,
            unitPrice: product.unitPrice,
            supplier: product.supplier,
          })
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load form data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    const payload = {
      ...form,
      quantity: Number(form.quantity),
      unitPrice: Number(form.unitPrice),
    }

    try {
      if (id) {
        await productService.updateProduct(id, payload)
        toast.success('Product updated')
      } else {
        await productService.createProduct(payload)
        toast.success('Product created')
      }

      navigate('/products')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save product')
      toast.error(err.response?.data?.message || 'Unable to save product')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Card className="max-w-3xl p-6">
        <Skeleton className="h-5 w-40" />
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      </Card>
    )
  }

  const categoryOptions = categories.map((category) => ({
    value: category._id,
    label: category.name,
  }))

  return (
    <div>
      <Link
        to="/products"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <PageHeader
        title={id ? 'Edit product' : 'Add product'}
        description={
          id
            ? 'Update the details of this product.'
            : 'Create a new item to track in your inventory.'
        }
      />

      <form onSubmit={handleSubmit} className="mt-6 max-w-3xl">
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </div>
        )}

        <Card className="p-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Product details
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Basic information used to identify this item.
            </p>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Input
              label="Product name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Wireless Mouse"
              required
            />

            <Input
              label="SKU"
              type="text"
              name="sku"
              value={form.sku}
              onChange={handleChange}
              placeholder="e.g. EL-MOU-001"
              hint="Saved in uppercase and must be unique"
              required
            />

            <Select
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              options={categoryOptions}
              placeholder="Select a category"
              required
            />

            <Input
              label="Supplier"
              type="text"
              name="supplier"
              value={form.supplier}
              onChange={handleChange}
              placeholder="e.g. Logi Distributors"
            />
          </div>
        </Card>

        <Card className="mt-5 p-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Pricing and stock
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Stock status is calculated automatically from quantity.
            </p>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Input
              label="Unit price"
              type="number"
              name="unitPrice"
              value={form.unitPrice}
              onChange={handleChange}
              min={0}
              step="0.01"
              required
            />

            <Input
              label="Quantity"
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              min={0}
              required
            />
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2.5 dark:bg-slate-800/50">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              More than 10 units is <strong>In Stock</strong>, 1 to 10 is{' '}
              <strong>Low Stock</strong>, and 0 is <strong>Out of Stock</strong>.
            </p>
          </div>
        </Card>

        <Card className="mt-5 p-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Description</h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Optional notes about this product.
            </p>
          </div>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Add any details that help identify this product..."
            className="mt-5 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </Card>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            onClick={() => navigate('/products')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button type="submit" loading={isSubmitting}>
            {isSubmitting ? 'Saving' : 'Save product'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm
