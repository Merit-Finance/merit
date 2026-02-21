import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth.stores'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { authService } from '@/services/auth.service'

export const Route = createFileRoute('/')({
  component: LoginPage,
})

const OTP_TIMEOUT_SECONDS = 600

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

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: '',
  })

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
    if (error) {
      clearError()
    }
  }

  const handleOtpChange = (value: string) => {
    setFormData((prev) => ({ ...prev, otp: value }))
    if (validationErrors.otp) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.otp
        return newErrors
      })
    }
    if (error) {
      clearError()
    }
  }

  const validateEmail = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validatePasswordLogin = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateOtp = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.otp || formData.otp.length !== 6) {
      errors.otp = 'Please enter a valid 6-digit OTP'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail()) return

    try {
      await sendOTP(formData.email)
      setOtpSent(true)
      setTimeRemaining(OTP_TIMEOUT_SECONDS)
    } catch (err) {
      console.error('Failed to send OTP:', err)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateOtp()) return

    try {
      await verifyOTP(formData.email, formData.otp)
      navigate({ to: '/dashboard' })
    } catch (err) {
      console.error('OTP verification failed:', err)
    }
  }

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePasswordLogin()) return

    try {
      await loginWithPassword(formData.email, formData.password)
      navigate({ to: '/dashboard' })
    } catch (err) {
      console.error('Password login failed:', err)
    }
  }

  const handleResendOTP = async () => {
    try {
      setFormData((prev) => ({ ...prev, otp: '' }))
      clearError()

      await authService.resendOTP(formData.email)

      setTimeRemaining(OTP_TIMEOUT_SECONDS)
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Failed to resend OTP. Please try again.'

      console.error('Failed to resend OTP:', errorMessage)
    }
  }

  const handleWrongEmail = () => {
    setOtpSent(false)
    setTimeRemaining(OTP_TIMEOUT_SECONDS)
    setFormData((prev) => ({ ...prev, otp: '' }))
    clearError()
  }

  const switchToPassword = () => {
    setLoginMethod('password')
    setOtpSent(false)
    setShowPassword(false)
    setFormData((prev) => ({ ...prev, otp: '', password: '' }))
    setValidationErrors({})
    clearError()
  }

  const switchToOTP = () => {
    setLoginMethod('otp')
    setOtpSent(false)
    setShowPassword(false)
    setFormData((prev) => ({ ...prev, otp: '', password: '' }))
    setValidationErrors({})
    clearError()
  }

  useEffect(() => {
    if (formData.otp.length === 6 && !isLoading && !isOtpExpired) {
      handleVerifyOTP(new Event('submit') as any)
    }
  }, [formData.otp])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <div className="space-y-2 text-center mb-6">
            <h2 className="text-2xl font-semibold">Welcome Back</h2>
            <p className="text-gray-600 text-sm">
              {otpSent
                ? 'Enter the code sent to your email'
                : loginMethod === 'otp'
                  ? 'Enter your email to receive a login code'
                  : 'Enter your email and password to login'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {loginMethod === 'otp' && !otpSent && (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-5 ${
                      validationErrors.email ? 'border-red-500' : ''
                    }`}
                    aria-invalid={!!validationErrors.email}
                    disabled={isLoading}
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary cursor-pointer hover:bg-primary-light text-white py-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending code...' : 'Continue with OTP'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={switchToPassword}
                  className="text-sm text-primary hover:underline"
                >
                  Login with password instead
                </button>
              </div>
            </form>
          )}

          {loginMethod === 'otp' && otpSent && (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full pl-10 pr-4 py-5 bg-gray-50"
                  />
                </div>
                <p className="text-right text-sm mt-1">
                  <span className="text-gray-600">Wrong email? </span>
                  <button
                    type="button"
                    onClick={handleWrongEmail}
                    className="text-primary hover:underline"
                  >
                    Change it
                  </button>
                </p>
              </div>

              <div>
                <Label htmlFor="otp">Verification Code</Label>
                <div className="mt-2">
                  <InputOTP
                    id="otp"
                    maxLength={6}
                    value={formData.otp}
                    onChange={handleOtpChange}
                    disabled={isLoading || isOtpExpired}
                    pattern={REGEXP_ONLY_DIGITS}
                  >
                    <InputOTPGroup className="grid grid-cols-6 gap-2 w-full">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {validationErrors.otp && (
                  <p className="text-xs text-red-500 mt-1">
                    {validationErrors.otp}
                  </p>
                )}
                <p className="text-right text-sm text-gray-600 mt-2">
                  {isOtpExpired ? (
                    <span className="text-red-500">Code expired. </span>
                  ) : (
                    <>
                      Time remaining: {Math.floor(timeRemaining / 60)}:
                      {String(timeRemaining % 60).padStart(2, '0')}.{' '}
                    </>
                  )}
                  Didn't receive it?{' '}
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="text-primary hover:underline disabled:opacity-50"
                  >
                    Resend
                  </button>
                </p>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={switchToPassword}
                  className="text-sm text-primary hover:underline"
                >
                  Login with password instead
                </button>
              </div>
            </form>
          )}

          {loginMethod === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-5">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-5 ${
                      validationErrors.email ? 'border-red-500' : ''
                    }`}
                    aria-invalid={!!validationErrors.email}
                    disabled={isLoading}
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-5 ${
                      validationErrors.password ? 'border-red-500' : ''
                    }`}
                    aria-invalid={!!validationErrors.password}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {validationErrors.password}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer bg-primary hover:bg-primary-light text-white py-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>

              <div className="text-center space-y-2">
                <Link
                  to="/"
                  className="text-sm text-primary hover:underline block"
                >
                  Forgot password?
                </Link>
                <button
                  type="button"
                  onClick={switchToOTP}
                  className="text-sm cursor-pointer text-primary hover:underline"
                >
                  Login with OTP instead
                </button>
              </div>
            </form>
          )}

          <p className="text-sm text-center text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-primary cursor-pointer hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
