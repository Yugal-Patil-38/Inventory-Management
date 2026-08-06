import { Loader2 } from 'lucide-react'

const variants = {
  primary:
    'bg-brand-900 text-white shadow-sm hover:bg-brand-800 focus:ring-brand-900/30 disabled:bg-brand-900/40 dark:bg-brand-600 dark:hover:bg-brand-500 dark:disabled:bg-brand-900',
  secondary:
    'bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-400/20 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:border-slate-600',
  danger:
    'bg-red-600 text-white shadow-sm hover:bg-red-700 focus:ring-red-500/30 disabled:bg-red-300 dark:disabled:bg-red-900',
  outline:
    'bg-transparent text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 focus:ring-slate-400/20 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white',
  ghost:
    'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-400/20 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white',
}

const sizes = {
  sm: 'h-8 gap-1.5 px-3 text-xs',
  md: 'h-10 gap-2 px-4 text-sm',
  lg: 'h-11 gap-2 px-5 text-sm',
}

function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  icon: Icon,
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 focus:outline-none focus:ring-4 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        Icon && <Icon className="h-4 w-4" />
      )}

      {children}
    </button>
  )
}

export default Button
