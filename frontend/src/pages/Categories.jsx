import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Plus, Tags } from 'lucide-react'
import categoryService from '../services/categoryService'
import CategoryCard from '../components/categories/CategoryCard'
import CategoryForm from '../components/categories/CategoryForm'
import ConfirmDialog from '../components/common/ConfirmDialog'
import PageHeader from '../components/common/PageHeader'
import Modal from '../components/common/Modal'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import EmptyState from '../components/common/EmptyState'
import { Skeleton } from '../components/common/Skeleton'

function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [deletingCategory, setDeletingCategory] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadCategories = async () => {
    setLoading(true)

    try {
      const data = await categoryService.getCategories()
      setCategories(data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const openCreateForm = () => {
    setEditingCategory(null)
    setFormError('')
    setIsFormOpen(true)
  }

  const openEditForm = (category) => {
    setEditingCategory(category)
    setFormError('')
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingCategory(null)
  }

  const handleSubmit = async (formValues) => {
    setFormError('')
    setIsSubmitting(true)

    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory._id, formValues)
        toast.success('Category updated')
      } else {
        await categoryService.createCategory(formValues)
        toast.success('Category created')
      }

      closeForm()
      loadCategories()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Unable to save category')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      await categoryService.deleteCategory(deletingCategory._id)
      toast.success('Category deleted')
      setDeletingCategory(null)
      loadCategories()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to delete category')
      setDeletingCategory(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Group your products for easier management."
        action={
          <Button icon={Plus} onClick={openCreateForm}>
            Add Category
          </Button>
        }
      />

      {loading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="mt-4 h-5 w-32" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-4 h-4 w-24" />
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <Card className="mt-6">
          <EmptyState
            icon={Tags}
            title="No categories yet"
            message="Categories help you organise products. Create your first one to get started."
            action={
              <Button icon={Plus} onClick={openCreateForm}>
                Add Category
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard
              key={category._id}
              category={category}
              onEdit={openEditForm}
              onDelete={setDeletingCategory}
            />
          ))}
        </div>
      )}

      {isFormOpen && (
        <Modal
          title={editingCategory ? 'Edit category' : 'Add category'}
          description={
            editingCategory
              ? 'Update the name or description of this category.'
              : 'Create a new group to organise your products.'
          }
          onClose={closeForm}
        >
          <CategoryForm
            category={editingCategory}
            onSubmit={handleSubmit}
            onCancel={closeForm}
            isSubmitting={isSubmitting}
            error={formError}
          />
        </Modal>
      )}

      {deletingCategory && (
        <ConfirmDialog
          title="Delete category"
          message={`"${deletingCategory.name}" will be permanently removed. Categories that still contain products cannot be deleted.`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingCategory(null)}
          isBusy={isDeleting}
        />
      )}
    </div>
  )
}

export default Categories
