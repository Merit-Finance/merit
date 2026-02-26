import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { MeritLogo } from '@/assets'
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  TrendingUp,
  Users,
  Zap,
  Shield,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/auth.stores'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { authService } from '@/services/auth.service'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

const OTP_TIMEOUT_SECONDS = 600

const STATS = [
  { icon: TrendingUp, value: '$2.4M+', label: 'Total Earned' },
  { icon: Users, value: '12,000+', label: 'Members' },
  { icon: Zap, value: '< 1 min', label: 'Avg Payout' },
  { icon: Shield, value: '99.9%', label: 'Success Rate' },
]

const TICKER_ITEMS = [
  '$2.4M+ total earned',
  '12,000+ active members',
  'Instant withdrawals',
  '99.9% payout success',
  'Level up & earn more',
  'Referral rewards daily',
]

function Ticker({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={`overflow-hidden py-2.5 border-t ${dark ? `border-white/10` : `border-gray-200 bg-gray-50`}`}
    >
      <div
        className="flex gap-8 w-max"
        style={{ animation: 'ticker 20s linear infinite' }}
      >
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span
            key={i}
            className={`text-xs whitespace-nowrap flex items-center gap-2 ${dark ? `text-white/40` : `text-gray-500`}`}
          >
            <span className="w-1 h-1 rounded-full bg-primary inline-block pointer-events-none" />
            {item}
          </span>
        ))}
      </div>
      <style>{`@keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`}</style>
    </div>
  )
}

interface FormProps {
  loginMethod: 'otp' | 'password'
  otpSent: boolean
  isLoading: boolean
  error: string | null
  formData: { email: string; password: string; otp: string }
  validationErrors: Record<string, string>
  timeRemaining: number
  isOtpExpired: boolean
  showPassword: boolean
  onSendOTP: (e: React.FormEvent) => void
  onVerifyOTP: (e: React.FormEvent) => void
  onPasswordLogin: (e: React.FormEvent) => void
  onResendOTP: () => void
  onWrongEmail: () => void
  onSwitchToPassword: () => void
  onSwitchToOTP: () => void
  onChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeOTP: (value: string) => void
  onTogglePassword: () => void
}

function TheForm({
  loginMethod,
  otpSent,
  isLoading,
  error,
  formData,
  validationErrors,
  timeRemaining,
  isOtpExpired,
  showPassword,
  onSendOTP,
  onVerifyOTP,
  onPasswordLogin,
  onResendOTP,
  onWrongEmail,
  onSwitchToPassword,
  onSwitchToOTP,
  onChangeInput,
  onChangeOTP,
  onTogglePassword,
}: FormProps) {
  return (
    <div>
      {error && (
        <div className="mb-4 p-3.5 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {loginMethod === 'otp' && !otpSent && (
        <form onSubmit={onSendOTP} className="space-y-4">
          <div>
            <Label
              htmlFor="email"
              className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              Email
            </Label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={onChangeInput}
                disabled={isLoading}
                className={`pl-10 py-5 ${validationErrors.email ? `border-red-400` : ``}`}
              />
            </div>
            {validationErrors.email && (
              <p className="text-xs text-red-500 mt-1.5">
                {validationErrors.email}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-light text-white py-5 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            {isLoading ? (
              'Sending...'
            ) : (
              <>
                <span>Continue with OTP</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
          <p className="text-center text-sm text-gray-400 pt-1">
            <button
              type="button"
              onClick={onSwitchToPassword}
              className="hover:text-primary transition-colors"
            >
              Use password instead
            </button>
          </p>
        </form>
      )}

      {loginMethod === 'otp' && otpSent && (
        <form onSubmit={onVerifyOTP} className="space-y-4">
          <div>
            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Email
            </Label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
              <Input
                type="email"
                value={formData.email}
                disabled
                className="pl-10 py-5 opacity-50 cursor-not-allowed"
              />
            </div>
            <button
              type="button"
              onClick={onWrongEmail}
              className="text-xs cursor-pointer text-primary hover:underline mt-1.5 block"
            >
              Wrong email? Change it
            </button>
          </div>
          <div>
            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Verification code
            </Label>
            <div className="mt-1.5">
              <InputOTP
                maxLength={6}
                value={formData.otp}
                onChange={onChangeOTP}
                disabled={isLoading || isOtpExpired}
                pattern={REGEXP_ONLY_DIGITS}
              >
                <InputOTPGroup className="grid grid-cols-6 gap-2 w-full">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            {validationErrors.otp && (
              <p className="text-xs text-red-500 mt-1.5">
                {validationErrors.otp}
              </p>
            )}
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-400">
                {isOtpExpired ? (
                  <span className="text-red-500">Code expired</span>
                ) : (
                  <>
                    {Math.floor(timeRemaining / 60)}:
                    {String(timeRemaining % 60).padStart(2, '0')} remaining
                  </>
                )}
              </span>
              <button
                type="button"
                onClick={onResendOTP}
                disabled={isLoading}
                className="text-xs cursor-pointer text-primary hover:underline disabled:opacity-40"
              >
                Resend
              </button>
            </div>
          </div>
          <p className="text-center text-sm text-gray-400">
            <button
              type="button"
              onClick={onSwitchToPassword}
              className="hover:text-primary cursor-pointer transition-colors"
            >
              Use password instead
            </button>
          </p>
        </form>
      )}

      {loginMethod === 'password' && (
        <form onSubmit={onPasswordLogin} className="space-y-4">
          <div>
            <Label
              htmlFor="email"
              className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              Email
            </Label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={onChangeInput}
                disabled={isLoading}
                className={`pl-10 py-5 ${validationErrors.email ? `border-red-400` : ``}`}
              />
            </div>
            {validationErrors.email && (
              <p className="text-xs text-red-500 mt-1.5">
                {validationErrors.email}
              </p>
            )}
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Password
              </Label>
              <Link
                to="/forgot-password"
                className="text-primary font-semibold hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={onChangeInput}
                disabled={isLoading}
                className={`pl-10 pr-11 py-5 ${validationErrors.password ? `border-red-400` : ``}`}
              />
              <button
                type="button"
                onClick={onTogglePassword}
                className="absolute right-3.5 cursor-pointer top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
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
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary cursor-pointer hover:bg-primary-light text-white py-5 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            {isLoading ? (
              'Signing in...'
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
          <p className="text-center text-sm text-gray-400 pt-1">
            <button
              type="button"
              onClick={onSwitchToOTP}
              className="hover:text-primary cursor-pointer transition-colors"
            >
              Use OTP instead
            </button>
          </p>
        </form>
      )}

      <p className="text-sm text-center text-gray-400 pt-4">
        No account?{' '}
        <Link
          to="/signup"
          className="text-primary cursor-pointer font-semibold hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  )
}

function LoginPage() {
  const navigate = useNavigate()
  const {
    sendOTP,
    verifyOTP,
    loginWithPassword,
    isLoading,
    error,
    clearError,
  } = useAuthStore()

  const [loginMethod, setLoginMethod] = useState<'otp' | 'password'>('otp')
  const [otpSent, setOtpSent] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(OTP_TIMEOUT_SECONDS)
  const [showPassword, setShowPassword] = useState(false)
  const isSubmittingOtp = useRef(false)
  const [formData, setFormData] = useState({ email: '', password: '', otp: '' })
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({})

  useEffect(() => {
    if (!otpSent) return
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [otpSent])

  const isOtpExpired = timeRemaining === 0

  useEffect(() => {
    if (
      loginMethod === 'otp' &&
      otpSent &&
      formData.otp.length === 6 &&
      !isLoading &&
      !isOtpExpired &&
      !error &&
      !isSubmittingOtp.current
    ) {
      isSubmittingOtp.current = true
      verifyOTP(formData.email, formData.otp)
        .then(() => navigate({ to: '/dashboard' }))
        .catch(() => setFormData((prev) => ({ ...prev, otp: '' })))
        .finally(() => {
          isSubmittingOtp.current = false
        })
    }
  }, [formData.otp])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (validationErrors[name])
      setValidationErrors((prev) => {
        const n = { ...prev }
        delete n[name]
        return n
      })
    if (error) clearError()
  }

  const handleOtpChange = (value: string) => {
    setFormData((prev) => ({ ...prev, otp: value }))
    if (validationErrors.otp)
      setValidationErrors((prev) => {
        const n = { ...prev }
        delete n.otp
        return n
      })
    if (error) clearError()
  }

  const validateEmail = () => {
    const errors: Record<string, string> = {}
    if (!formData.email.trim()) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = 'Enter a valid email'
    setValidationErrors(errors)
    return !Object.keys(errors).length
  }

  const validatePasswordLogin = () => {
    const errors: Record<string, string> = {}
    if (!formData.email.trim()) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = 'Enter a valid email'
    if (!formData.password) errors.password = 'Password is required'
    setValidationErrors(errors)
    return !Object.keys(errors).length
  }

  const validateOtp = () => {
    const errors: Record<string, string> = {}
    if (!formData.otp || formData.otp.length !== 6)
      errors.otp = 'Enter a valid 6-digit code'
    setValidationErrors(errors)
    return !Object.keys(errors).length
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateEmail()) return
    try {
      await sendOTP(formData.email)
      setOtpSent(true)
      setTimeRemaining(OTP_TIMEOUT_SECONDS)
    } catch {}
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateOtp()) return
    try {
      await verifyOTP(formData.email, formData.otp)
      navigate({ to: '/dashboard' })
    } catch {
      setFormData((prev) => ({ ...prev, otp: '' }))
    }
  }

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validatePasswordLogin()) return
    try {
      await loginWithPassword(formData.email, formData.password)
      navigate({ to: '/dashboard' })
    } catch {}
  }

  const handleResendOTP = async () => {
    try {
      setFormData((prev) => ({ ...prev, otp: '' }))
      clearError()
      isSubmittingOtp.current = false
      await authService.resendOTP(formData.email)
      setTimeRemaining(OTP_TIMEOUT_SECONDS)
    } catch (err: any) {
      console.error(err.response?.data?.message || 'Failed to resend')
    }
  }

  const handleWrongEmail = () => {
    setOtpSent(false)
    setTimeRemaining(OTP_TIMEOUT_SECONDS)
    isSubmittingOtp.current = false
    setFormData((prev) => ({ ...prev, otp: '' }))
    clearError()
  }

  const switchToPassword = () => {
    setLoginMethod('password')
    setOtpSent(false)
    setShowPassword(false)
    isSubmittingOtp.current = false
    setFormData((prev) => ({ ...prev, otp: '', password: '' }))
    setValidationErrors({})
    clearError()
  }

  const switchToOTP = () => {
    setLoginMethod('otp')
    setOtpSent(false)
    setShowPassword(false)
    isSubmittingOtp.current = false
    setFormData((prev) => ({ ...prev, otp: '', password: '' }))
    setValidationErrors({})
    clearError()
  }

  const heading = otpSent ? 'Check your inbox' : 'Welcome back'
  const subheading = otpSent
    ? 'Enter the 6-digit code we sent you'
    : loginMethod === 'otp'
      ? 'Enter your email to get a login code'
      : 'Sign in to your account'

  const formProps: FormProps = {
    loginMethod,
    otpSent,
    isLoading,
    error,
    formData,
    validationErrors,
    timeRemaining,
    isOtpExpired,
    showPassword,
    onSendOTP: handleSendOTP,
    onVerifyOTP: handleVerifyOTP,
    onPasswordLogin: handlePasswordLogin,
    onResendOTP: handleResendOTP,
    onWrongEmail: handleWrongEmail,
    onSwitchToPassword: switchToPassword,
    onSwitchToOTP: switchToOTP,
    onChangeInput: handleChange,
    onChangeOTP: handleOtpChange,
    onTogglePassword: () => setShowPassword((p) => !p),
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
            <div className="flex items-center gap-2 mb-5">
              <MeritLogo className="h-6 w-6 text-[#008FE9]" />
              <span className="text-white font-semibold text-base">
                Merit Finance
              </span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/70 text-xs">
                Live earnings network
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white leading-tight tracking-tight">
              Your money <span className="text-primary">works harder</span>{' '}
              here.
            </h1>
            <div className="flex gap-5 mt-4">
              {[
                { v: '$2.4M+', l: 'Earned' },
                { v: '12K+', l: 'Members' },
                { v: '<1min', l: 'Payout' },
              ].map((s) => (
                <div key={s.l}>
                  <p className="text-white font-bold text-sm">{s.v}</p>
                  <p className="text-white/35 text-xs">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Ticker dark={false} />

        <div className="flex-1 bg-white px-6 pt-8 pb-12">
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-gray-900">{heading}</h2>
            <p className="text-gray-500 text-sm mt-1">{subheading}</p>
          </div>
          <TheForm {...formProps} />
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

          <div
            onClick={() => navigate({ to: '/' })}
            className="relative z-10 flex items-center gap-2.5 cursor-pointer"
          >
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
                  Live earnings network
                </span>
              </div>
              <h1 className="text-4xl font-bold text-white leading-[1.1] tracking-tight">
                Your money
                <br />
                <span className="text-primary">works harder</span>
                <br />
                here.
              </h1>
              <p className="text-white/35 mt-3 text-sm leading-relaxed max-w-xs">
                Join thousands earning daily. Unlock levels, complete positions,
                and withdraw instantly.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {STATS.map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="bg-white/5 border border-white/8 rounded-xl p-3.5"
                >
                  <Icon className="w-3.5 h-3.5 text-primary mb-1.5" />
                  <p className="text-white font-bold text-lg leading-none">
                    {value}
                  </p>
                  <p className="text-white/30 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary font-bold text-sm">
                J
              </div>
              <div>
                <p className="text-white/50 text-xs leading-relaxed">
                  "Hit Level 3 in two weeks. Payouts land same day, every time."
                </p>
                <p className="text-white/25 text-xs mt-0.5">
                  James O. · Level 3 Member
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <Ticker dark={true} />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-16 bg-white overflow-y-auto">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">{heading}</h2>
              <p className="text-gray-500 text-sm mt-1.5">{subheading}</p>
            </div>
            <TheForm {...formProps} />
          </div>
        </div>
      </div>
    </div>
  )
}
