import { X } from 'lucide-react'

function Modal({ title, description, onClose, size = 'md', children }) {
  const width = size === 'lg' ? 'max-w-lg' : 'max-w-md'

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm dark:bg-slate-950/70">
      <div
        className={`w-full ${width} animate-[fadeIn_150ms_ease-out] rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </h3>
            {description && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5">{children}</div>
      </div>
    </div>
  )
}

export default Modal
