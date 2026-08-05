import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from './Button'

function Pagination({ page, totalPages, totalItems, onPageChange }) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-3.5 dark:border-slate-800">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Page{' '}
        <span className="font-medium text-slate-900 dark:text-slate-100">
          {page}
        </span>{' '}
        of{' '}
        <span className="font-medium text-slate-900 dark:text-slate-100">
          {totalPages}
        </span>
        <span className="text-slate-400 dark:text-slate-500">
          {' '}
          &middot; {totalItems} items
        </span>
      </p>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          icon={ChevronLeft}
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default Pagination
