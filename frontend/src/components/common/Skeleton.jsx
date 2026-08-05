function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200 dark:bg-slate-800 ${className}`}
    />
  )
}

function TableSkeleton({ rows = 5, columns = 5 }) {
  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-4 px-5 py-4">
          {Array.from({ length: columns }).map((_, columnIndex) => (
            <Skeleton
              key={columnIndex}
              className={`h-4 ${columnIndex === 0 ? 'w-1/4' : 'flex-1'}`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function CardSkeleton({ count = 5 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="mt-4 h-3 w-20" />
          <Skeleton className="mt-2 h-7 w-16" />
        </div>
      ))}
    </>
  )
}

export { Skeleton, TableSkeleton, CardSkeleton }
