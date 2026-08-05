function Input({
  label,
  error,
  hint,
  required,
  icon: Icon,
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
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        )}

        <input
          required={required}
          className={`h-10 w-full rounded-lg border bg-white text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-4 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 ${
            Icon ? 'pl-9 pr-3' : 'px-3'
          } ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 dark:border-red-800'
              : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-700 dark:focus:border-blue-500'
          }`}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
          {hint}
        </p>
      )}
    </div>
  )
}

export default Input
