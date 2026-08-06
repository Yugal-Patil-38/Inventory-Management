import { useContext } from 'react'
import { Tag, Pencil, Trash2, Package } from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'
import Button from '../common/Button'
import { formatDate } from '../../utils/formatters'

function CategoryCard({ category, onEdit, onDelete }) {
  const { user } = useContext(AuthContext)

  return (
    <div className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 transition-transform duration-200 group-hover:scale-105 dark:bg-brand-400/10">
          <Tag className="h-5 w-5 text-brand-800 dark:text-brand-400" />
        </div>

        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(category)}
            title="Edit category"
          >
            <Pencil className="h-4 w-4" />
          </Button>

          {user?.role === 'admin' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(category)}
              title="Delete category"
              className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
        {category.name}
      </h3>

      <p className="mt-1 line-clamp-2 flex-1 text-sm text-slate-500 dark:text-slate-400">
        {category.description || 'No description provided.'}
      </p>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
        <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
          <Package className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          {category.productCount}
          <span className="font-normal text-slate-400 dark:text-slate-500">
            {category.productCount === 1 ? 'product' : 'products'}
          </span>
        </span>

        <span className="text-xs text-slate-400 dark:text-slate-500">
          {formatDate(category.createdAt)}
        </span>
      </div>
    </div>
  )
}

export default CategoryCard
