import { ChevronDown } from 'lucide-react'

function Select({
  label,
  options,
  placeholder,
  error,
  required,
  className = '',
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          required={required}
          className={`h-10 w-full appearance-none rounded-lg border bg-white pl-3 pr-9 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-4 dark:bg-slate-900 dark:text-slate-100 ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 dark:border-red-800'
              : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-700 dark:focus:border-blue-500'
          }`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}

export default Select
