const tones = {
  brand: 'bg-brand-50 text-brand-800 dark:bg-brand-400/10 dark:text-brand-400',
  slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  green: 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
  red: 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
}

function StatCard({ icon: Icon, label, value, description, tone = 'brand' }) {
  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105 ${tones[tone]}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
        {description}
      </p>
    </div>
  )
}

export default StatCard
