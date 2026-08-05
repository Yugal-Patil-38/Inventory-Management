import { Search } from 'lucide-react'
import Input from '../common/Input'
import Select from '../common/Select'

const statusOptions = [
  { value: 'In Stock', label: 'In Stock' },
  { value: 'Low Stock', label: 'Low Stock' },
  { value: 'Out of Stock', label: 'Out of Stock' },
]

const sortOptions = [
  { value: 'createdAt-desc', label: 'Newest first' },
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'unitPrice-asc', label: 'Price low to high' },
  { value: 'unitPrice-desc', label: 'Price high to low' },
  { value: 'quantity-asc', label: 'Quantity low to high' },
]

function ProductFilters({ filters, categories, onChange, onSortChange }) {
  const categoryOptions = categories.map((category) => ({
    value: category._id,
    label: category.name,
  }))

  return (
    <div className="grid gap-3 border-b border-slate-200 p-4 sm:grid-cols-2 lg:grid-cols-4 dark:border-slate-800">
      <Input
        type="text"
        name="search"
        value={filters.search}
        onChange={onChange}
        placeholder="Search name or SKU..."
        icon={Search}
      />

      <Select
        name="category"
        value={filters.category}
        onChange={onChange}
        options={categoryOptions}
        placeholder="All categories"
      />

      <Select
        name="status"
        value={filters.status}
        onChange={onChange}
        options={statusOptions}
        placeholder="All statuses"
      />

      <Select
        value={`${filters.sortBy}-${filters.order}`}
        onChange={onSortChange}
        options={sortOptions}
      />
    </div>
  )
}

export default ProductFilters
