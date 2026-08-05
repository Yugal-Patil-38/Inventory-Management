import { AlertTriangle } from 'lucide-react'
import Button from './Button'

function ConfirmDialog({ title, message, onConfirm, onCancel, isBusy }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm dark:bg-slate-950/70">
      <div className="w-full max-w-md animate-[fadeIn_150ms_ease-out] rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10">
          <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>

        <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {message}
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onCancel} disabled={isBusy}>
            Cancel
          </Button>

          <Button variant="danger" onClick={onConfirm} loading={isBusy}>
            {isBusy ? 'Deleting' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
