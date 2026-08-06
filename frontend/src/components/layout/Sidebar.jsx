import { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Tags,
  ArrowLeftRight,
  LogOut,
  Boxes,
} from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'

const menuLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/categories', label: 'Categories', icon: Tags },
  { to: '/inventory', label: 'Inventory', icon: ArrowLeftRight },
]

function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useContext(AuthContext)

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 dark:border-slate-800 dark:bg-slate-900 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-slate-200 px-5 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-900">
            <Boxes className="h-5 w-5 text-white" />
          </div>

          <div>
            <p className="text-sm font-semibold leading-tight text-slate-900 dark:text-slate-50">
              StockFlow
            </p>
            <p className="text-xs leading-tight text-slate-400 dark:text-slate-500">
              Inventory Manager
            </p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          <p className="px-3 pb-2 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Menu
          </p>

          {menuLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-50 text-brand-900 dark:bg-brand-400/10 dark:text-brand-400'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon
                    className={`h-4.5 w-4.5 transition-colors ${
                      isActive
                        ? 'text-brand-800 dark:text-brand-400'
                        : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'
                    }`}
                  />
                  {link.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-3 dark:border-slate-800">
          <div className="mb-2 flex items-center gap-2.5 rounded-lg px-3 py-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-900 text-xs font-semibold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </span>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                {user?.name}
              </p>
              <p className="truncate text-xs capitalize text-slate-400 dark:text-slate-500">
                {user?.role}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-all duration-150 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
          >
            <LogOut className="h-4.5 w-4.5 text-slate-400 transition-colors group-hover:text-red-500 dark:text-slate-500" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
