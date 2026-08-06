import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Boxes, User, Mail, Lock } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm({ ...form, [name]: value })
    setErrors({ ...errors, [name]: '' })
  }

  const validate = () => {
    const nextErrors = {}

    if (!form.name.trim()) {
      nextErrors.name = 'Name is required'
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required'
    }

    if (!form.password) {
      nextErrors.password = 'Password is required'
    } else if (form.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters'
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password'
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match'
    }

    return nextErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      await register(form.name, form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to register')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
            <Boxes className="h-6 w-6 text-white" />
          </div>

          <h1 className="mt-5 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Start managing inventory in minutes
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Input
              label="Full name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Cooper"
              icon={User}
              error={errors.name}
              required
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@company.com"
              icon={Mail}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              icon={Lock}
              error={errors.password}
              required
            />

            <Input
              label="Confirm password"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              icon={Lock}
              error={errors.confirmPassword}
              required
            />

            <Button
              type="submit"
              size="lg"
              loading={isSubmitting}
              className="mt-2 w-full"
            >
              {isSubmitting ? 'Creating account' : 'Create account'}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
