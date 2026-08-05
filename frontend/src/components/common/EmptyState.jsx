function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
          <Icon className="h-6 w-6 text-slate-400 dark:text-slate-500" />
        </div>
      )}

      <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </p>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        {message}
      </p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export default EmptyState
