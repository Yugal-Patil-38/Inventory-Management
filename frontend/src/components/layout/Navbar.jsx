import { useState, useContext } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import {
  Menu,
  Search,
  Bell,
  ChevronRight,
  LogOut,
  User,
  Sun,
  Moon,
} from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'
import { ThemeContext } from '../../context/ThemeContext'

const routeLabels = {
  products: 'Products',
  categories: 'Categories',
  inventory: 'Inventory',
  new: 'Add Product',
  edit: 'Edit Product',
}

function Navbar({ onMenuClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [search, setSearch] = useState('')

  const { user, logout } = useContext(AuthContext)
  const { theme, toggleTheme } = useContext(ThemeContext)
  const location = useLocation()
  const navigate = useNavigate()

  const crumbs = location.pathname
    .split('/')
    .filter(Boolean)
    .filter((segment) => routeLabels[segment])
    .map((segment) => routeLabels[segment])

  const handleSearch = (event) => {
    event.preventDefault()

    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6 dark:border-slate-800 dark:bg-slate-900">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
      >
        <Menu className="h-5 w-5" />
      </button>

      <nav className="hidden items-center gap-1.5 text-sm sm:flex">
        <Link
          to="/"
          className="text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          Home
        </Link>

        {crumbs.map((crumb) => (
          <span key={crumb} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {crumb}
            </span>
          </span>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-1.5">
        <form onSubmit={handleSearch} className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products..."
            className="h-9 w-56 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-brand-700 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-900/15 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-800"
          />
        </form>

        <button
          type="button"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-900 ring-2 ring-white dark:ring-slate-900" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 rounded-lg p-1 pr-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-900 text-xs font-semibold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </span>

            <span className="hidden text-sm font-medium text-slate-700 sm:block dark:text-slate-200">
              {user?.name}
            </span>
          </button>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsMenuOpen(false)}
              />

              <div className="absolute right-0 z-20 mt-2 w-56 animate-[fadeIn_150ms_ease-out] rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-3 border-b border-slate-100 px-3 py-2.5 dark:border-slate-800">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-900 text-sm font-semibold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                      {user?.name}
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  Profile
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                >
                  <LogOut className="h-4 w-4 text-slate-400" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
