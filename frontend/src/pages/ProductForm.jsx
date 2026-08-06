import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft, Info, Package } from 'lucide-react'
import productService from '../services/productService'
import categoryService from '../services/categoryService'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/common/Card'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import Textarea from '../components/common/Textarea'
import Button from '../components/common/Button'
import StatusBadge from '../components/common/StatusBadge'
import { Skeleton } from '../components/common/Skeleton'
import { formatCurrency } from '../utils/formatters'
import { getStockStatus } from '../utils/stockStatus'

const emptyForm = {
  name: '',
  sku: '',
  category: '',
  description: '',
  quantity: '',
  unitPrice: '',
  supplier: '',
}

function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
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
        toast.error(err.response?.data?.message || 'Unable to load form data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm({ ...form, [name]: value })
    setErrors({ ...errors, [name]: '' })
  }

  const validate = () => {
    const nextErrors = {}

    if (!form.name.trim()) {
      nextErrors.name = 'Product name is required'
    }

    if (!form.sku.trim()) {
      nextErrors.sku = 'SKU is required'
    }

    if (!form.category) {
      nextErrors.category = 'Please select a category'
    }

    if (form.unitPrice === '') {
      nextErrors.unitPrice = 'Unit price is required'
    } else if (Number(form.unitPrice) < 0) {
      nextErrors.unitPrice = 'Price cannot be negative'
    }

    if (form.quantity === '') {
      nextErrors.quantity = 'Quantity is required'
    } else if (Number(form.quantity) < 0) {
      nextErrors.quantity = 'Quantity cannot be negative'
    }

    return nextErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      toast.error('Please fix the highlighted fields')
      return
    }

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
      const message = err.response?.data?.message || 'Unable to save product'

      if (message.includes('SKU')) {
        setErrors({ sku: message })
      } else if (message.includes('category')) {
        setErrors({ category: message })
      }

      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="p-6">
            <Skeleton className="h-4 w-32" />
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <Skeleton className="h-4 w-32" />
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </Card>
        </div>

        <Card className="h-fit p-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-6 h-16 w-full" />
        </Card>
      </div>
    )
  }

  const categoryOptions = categories.map((category) => ({
    value: category._id,
    label: category.name,
  }))

  const previewQuantity = Number(form.quantity) || 0
  const previewValue = previewQuantity * (Number(form.unitPrice) || 0)
  const selectedCategory = categories.find(
    (category) => category._id === form.category
  )

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

      <form onSubmit={handleSubmit} noValidate className="mt-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Product details
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Basic information used to identify this item.
              </p>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Input
                  label="Product name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Wireless Mouse"
                  error={errors.name}
                  required
                />

                <Input
                  label="SKU"
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  placeholder="e.g. EL-MOU-001"
                  hint="Saved in uppercase and must be unique"
                  error={errors.sku}
                  required
                />

                <Select
                  label="Category"
                  value={form.category}
                  onChange={(value) => {
                    setForm({ ...form, category: value })
                    setErrors({ ...errors, category: '' })
                  }}
                  options={categoryOptions}
                  placeholder="Select a category"
                  error={errors.category}
                  required
                />

                <Input
                  label="Supplier"
                  name="supplier"
                  value={form.supplier}
                  onChange={handleChange}
                  placeholder="e.g. Logi Distributors"
                />
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Pricing and stock
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Stock status is calculated automatically from quantity.
              </p>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Input
                  label="Unit price"
                  type="number"
                  name="unitPrice"
                  value={form.unitPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  min={0}
                  step="0.01"
                  error={errors.unitPrice}
                  required
                />

                <Input
                  label="Quantity"
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="0"
                  min={0}
                  error={errors.quantity}
                  required
                />
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2.5 dark:bg-slate-800/50">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  More than 10 units is <strong>In Stock</strong>, 1 to 10 is{' '}
                  <strong>Low Stock</strong>, and 0 is{' '}
                  <strong>Out of Stock</strong>.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Description
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Optional notes about this product.
              </p>

              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Add any details that help identify this product..."
                className="mt-5"
              />
            </Card>
          </div>

          <div className="lg:sticky lg:top-22 lg:h-fit">
            <Card className="p-6">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Preview
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                How this product will appear.
              </p>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                  <Package className="h-4 w-4 text-slate-400" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                    {form.name || 'Untitled product'}
                  </p>
                  <p className="truncate font-mono text-xs text-slate-400 dark:text-slate-500">
                    {form.sku ? form.sku.toUpperCase() : 'NO-SKU'}
                  </p>
                </div>
              </div>

              <dl className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-sm text-slate-500 dark:text-slate-400">
                    Category
                  </dt>
                  <dd className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                    {selectedCategory ? selectedCategory.name : '—'}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <dt className="text-sm text-slate-500 dark:text-slate-400">
                    Status
                  </dt>
                  <dd>
                    <StatusBadge status={getStockStatus(previewQuantity)} />
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <dt className="text-sm text-slate-500 dark:text-slate-400">
                    Unit price
                  </dt>
                  <dd className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {formatCurrency(Number(form.unitPrice) || 0)}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <dt className="text-sm text-slate-500 dark:text-slate-400">
                    Total value
                  </dt>
                  <dd className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {formatCurrency(previewValue)}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-col gap-2">
                <Button type="submit" loading={isSubmitting} className="w-full">
                  {isSubmitting ? 'Saving' : id ? 'Save changes' : 'Create product'}
                </Button>

                <Button
                  variant="secondary"
                  onClick={() => navigate('/products')}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ProductForm
