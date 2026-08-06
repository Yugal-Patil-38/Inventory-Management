import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

function Select({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  required,
  disabled,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  const selectedOption = options.find((option) => option.value === value)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleSelect = (optionValue) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-10 w-full items-center justify-between gap-2 rounded-lg border bg-white pl-3 pr-2.5 text-sm transition-colors focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 dark:border-red-800'
            : 'border-slate-200 focus:border-brand-700 focus:ring-brand-900/15 dark:border-slate-700 dark:focus:border-brand-500'
        } ${
          selectedOption
            ? 'text-slate-900 dark:text-slate-100'
            : 'text-slate-400 dark:text-slate-500'
        }`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 z-30 mt-1.5 animate-[fadeIn_120ms_ease-out] overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <ul className="max-h-60 overflow-y-auto">
            {!required && (
              <li>
                <button
                  type="button"
                  onClick={() => handleSelect('')}
                  className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-500 transition-colors hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  {placeholder}
                  {!value && <Check className="h-4 w-4 shrink-0" />}
                </button>
              </li>
            )}

            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    option.value === value
                      ? 'bg-brand-50 font-medium text-brand-900 dark:bg-brand-400/10 dark:text-brand-400'
                      : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {option.value === value && (
                    <Check className="h-4 w-4 shrink-0" />
                  )}
                </button>
              </li>
            ))}

            {options.length === 0 && (
              <li className="px-3 py-2 text-sm text-slate-400 dark:text-slate-500">
                No options available
              </li>
            )}
          </ul>
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}

export default Select
