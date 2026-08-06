const tones = {
  green:
    'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20',
  amber:
    'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20',
  red: 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20',
  slate:
    'bg-slate-50 text-slate-600 ring-slate-500/20 dark:bg-slate-500/10 dark:text-slate-400 dark:ring-slate-500/20',
  brand: 'bg-brand-50 text-brand-900 ring-brand-900/20 dark:bg-brand-400/10 dark:text-brand-400 dark:ring-brand-400/20',
}

const dots = {
  green: 'bg-green-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  slate: 'bg-slate-400',
  brand: 'bg-brand-500',
}

function Badge({ tone = 'slate', dot = false, children }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${tones[tone]}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dots[tone]}`} />}
      {children}
    </span>
  )
}

export default Badge
