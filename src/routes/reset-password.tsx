import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MeritLogo } from '@/assets'
import { authService } from '@/services/auth.service'

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: typeof search.token === 'string' ? search.token : '',
    }
  },
})
function ResetPasswordPage() {
  const navigate = useNavigate()
  const { token } = Route.useSearch()

  const [step, setStep] = useState<'form' | 'success'>('form')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (validationErrors[name])
      setValidationErrors((prev) => {
        const n = { ...prev }
        delete n[name]
        return n
      })
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors: Record<string, string> = {}
    if (!formData.password) errors.password = 'Password is required'
    else if (formData.password.length < 6)
      errors.password = 'At least 6 characters'
    if (!formData.confirmPassword)
      errors.confirmPassword = 'Please confirm your password'
    else if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = 'Passwords do not match'
    if (Object.keys(errors).length) {
      setValidationErrors(errors)
      return
    }

    if (!token) {
      setError('Invalid or missing reset token.')
      return
    }

    setIsLoading(true)
    try {
      await authService.confirmResetPassword(token, formData.password)
      setStep('success')
    } catch {
      setError(
        'This reset link is invalid or has expired. Please request a new one.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const FormContent = () => {
    if (step === 'success') {
      return (
        <div className="flex flex-col items-center text-center gap-5 py-4">
          <div className="w-16 h-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-green-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Password updated!
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              You can now sign in with your new password.
            </p>
          </div>
          <Button
            onClick={() => navigate({ to: '/' })}
            className="w-full bg-primary cursor-pointer hover:bg-primary-light text-white py-5 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        {!token && (
          <div className="p-3.5 bg-yellow-50 border border-yellow-100 rounded-xl">
            <p className="text-sm text-yellow-700">
              Invalid reset link.{' '}
              <Link to="/forgot-password" className="underline font-semibold">
                Request a new one
              </Link>
            </p>
          </div>
        )}
        <div>
          <Label
            htmlFor="password"
            className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            New Password
          </Label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a new password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading || !token}
              className={`pl-10 pr-11 py-5 ${validationErrors.password ? 'border-red-400' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {validationErrors.password && (
            <p className="text-xs text-red-500 mt-1.5">
              {validationErrors.password}
            </p>
          )}
        </div>
        <div>
          <Label
            htmlFor="confirmPassword"
            className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Confirm Password
          </Label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm your new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading || !token}
              className={`pl-10 pr-11 py-5 ${validationErrors.confirmPassword ? 'border-red-400' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              {showConfirm ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {validationErrors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1.5">
              {validationErrors.confirmPassword}
            </p>
          )}
        </div>
        <Button
          type="submit"
          disabled={isLoading || !token}
          className="w-full bg-primary hover:bg-primary-light text-white py-5 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          {isLoading ? (
            'Updating...'
          ) : (
            <>
              <span>Set New Password</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
        <p className="text-center text-sm text-gray-400 pt-1">
          <Link to="/" className="hover:text-primary transition-colors">
            Back to Sign In
          </Link>
        </p>
      </form>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex flex-col flex-1 lg:hidden">
        <div className="relative bg-gray-900 px-6 pt-10 pb-8 overflow-hidden shrink-0">
          <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 -left-10 w-40 h-40 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/70 text-xs">
                Secure password reset
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white leading-tight tracking-tight">
              Create your <span className="text-primary">new password.</span>
            </h1>
          </div>
        </div>
        <div className="flex-1 bg-white px-6 pt-8 pb-12">
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 'success' ? 'All done!' : 'Set new password'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {step === 'success'
                ? 'Your password has been updated.'
                : 'Choose a strong password for your account.'}
            </p>
          </div>
          {FormContent()}
        </div>
      </div>

      <div className="hidden lg:flex h-screen overflow-hidden">
        <div className="w-[46%] bg-gray-900 flex flex-col justify-between py-8 px-12 relative overflow-hidden shrink-0">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-primary/8 blur-3xl" />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #fff 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
          </div>
          <div className="relative z-10 flex items-center gap-2.5">
            <MeritLogo className="h-6 w-6 text-[#008FE9]" />
            <span className="text-white font-semibold text-lg">
              Merit Finance
            </span>
          </div>
          <div className="relative z-10 space-y-5">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/8 border border-white/12 rounded-full px-3 py-1 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white/60 text-xs">
                  {step === 'success' ? 'All done!' : 'Almost there'}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-white leading-[1.1] tracking-tight">
                {step === 'success' ? (
                  <>
                    Password <span className="text-primary">updated!</span>
                  </>
                ) : (
                  <>
                    Create your <br />
                    <span className="text-primary">new password.</span>
                  </>
                )}
              </h1>
              <p className="text-white/35 mt-3 text-sm leading-relaxed max-w-xs">
                {step === 'success'
                  ? 'Your account is secure. You can now sign in with your new credentials.'
                  : 'Choose a strong password. It must be at least 6 characters long.'}
              </p>
            </div>
            {step === 'success' && (
              <div className="flex gap-3 items-center bg-white/5 border border-white/8 rounded-xl p-4">
                <ShieldCheck className="w-8 h-8 text-green-400 shrink-0" />
                <div>
                  <p className="text-white text-sm font-semibold">
                    Password updated
                  </p>
                  <p className="text-white/30 text-xs mt-0.5">
                    Your account is secure again
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="relative z-10 border-t border-white/10 pt-2.5" />
        </div>
        <div className="flex-1 flex items-center justify-center px-16 bg-white overflow-y-auto">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Password Reset
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {step === 'success' ? 'All done!' : 'Set new password'}
              </h2>
              <p className="text-gray-500 text-sm mt-1.5">
                {step === 'success'
                  ? 'Your password has been successfully updated.'
                  : 'Choose a strong password for your account.'}
              </p>
            </div>
            {FormContent()}
          </div>
        </div>
      </div>
    </div>
  )
}
