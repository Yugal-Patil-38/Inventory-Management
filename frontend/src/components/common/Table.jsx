function Table({ columns, minWidth = 'min-w-2xl', children }) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-left text-sm ${minWidth}`}>
        <thead className="bg-slate-50/80 dark:bg-slate-800/50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.label}
                className={`whitespace-nowrap border-b border-slate-200 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:text-slate-400 ${
                  column.align === 'right' ? 'text-right' : ''
                }`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {children}
        </tbody>
      </table>
    </div>
  )
}

export default Table
