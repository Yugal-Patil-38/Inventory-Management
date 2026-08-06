import { Boxes, Package, ArrowLeftRight, Bell, LayoutDashboard } from 'lucide-react'

const features = [
  {
    icon: Package,
    title: 'Product Catalog',
    description: 'Track every item with SKU and pricing',
  },
  {
    icon: ArrowLeftRight,
    title: 'Stock Control',
    description: 'Every movement kept in an audit trail',
  },
  {
    icon: Bell,
    title: 'Low Stock Alerts',
    description: 'Know the moment an item runs low',
  },
  {
    icon: LayoutDashboard,
    title: 'Live Dashboard',
    description: 'Inventory health at a glance',
  },
]

function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-blue-700 p-10 lg:flex xl:p-14">
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
            <Boxes className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">
            StockFlow
          </span>
        </div>

        <div className="relative">
          <h2 className="max-w-md text-4xl font-semibold leading-tight tracking-tight text-white">
            Inventory management, without the spreadsheets
          </h2>

          <p className="mt-4 max-w-md text-base text-blue-100">
            Everything your team needs to track stock accurately.
          </p>

          <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                  <feature.icon className="h-4 w-4 text-white" />
                </div>

                <p className="mt-3 text-sm font-semibold text-white">
                  {feature.title}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-blue-100">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-blue-200">
          &copy; {new Date().getFullYear()} StockFlow. All rights reserved.
        </p>
      </div>

      <div className="flex w-full items-center justify-center bg-slate-50 px-4 py-12 lg:w-1/2 dark:bg-slate-950">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center justify-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
              <Boxes className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              StockFlow
            </span>
          </div>

          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {title}
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          </div>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
