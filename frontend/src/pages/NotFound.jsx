import { Link } from 'react-router-dom'
import { FileQuestion, ArrowLeft } from 'lucide-react'
import Button from '../components/common/Button'

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center dark:bg-slate-950">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
        <FileQuestion className="h-7 w-7 text-slate-400" />
      </div>

      <p className="mt-6 text-sm font-semibold text-brand-800 dark:text-brand-400">404</p>

      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        Page not found
      </h1>

      <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        The page you are looking for does not exist or may have been moved.
      </p>

      <Link to="/" className="mt-6">
        <Button icon={ArrowLeft}>Back to dashboard</Button>
      </Link>
    </div>
  )
}

export default NotFound
