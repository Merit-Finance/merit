import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { MeritLogo } from '@/assets'
import {
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RegisterPayload } from '@/lib/auth'
import { useAuthStore } from '@/stores/auth.stores'

export const Route = createFileRoute('/signup')({
  component: SignupPage,
})

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
      className={`overflow-hidden py-2.5 border-t ${dark ? 'border-white/10' : 'border-gray-200 bg-gray-50'}`}
    >
      <div
        className="flex gap-8 w-max"
        style={{ animation: 'ticker 20s linear infinite' }}
      >
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <span
            key={i}
            className={`text-xs whitespace-nowrap flex items-center gap-2 ${dark ? 'text-white/40' : 'text-gray-500'}`}
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

function SignupPage() {
  const navigate = useNavigate()
  const { register, isLoading, error, clearError } = useAuthStore()

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: '',
    userName: '',
  })
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    if (!formData.name.trim()) errors.name = 'Full name is required'
    if (!formData.phoneNumber.trim())
      errors.phoneNumber = 'Phone number is required'
    else if (
      !/^\+?[1-9]\d{1,14}$/.test(formData.phoneNumber.replace(/\s/g, ''))
    )
      errors.phoneNumber = 'Enter a valid phone number'
    if (!formData.email.trim()) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = 'Enter a valid email'
    if (!formData.address.trim()) errors.address = 'Address is required'
    if (!formData.userName.trim()) errors.userName = 'Username is required'
    if (!formData.password) errors.password = 'Password is required'
    else if (formData.password.length < 6)
      errors.password = 'Password must be at least 6 characters'
    if (!formData.confirmPassword)
      errors.confirmPassword = 'Please confirm your password'
    else if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = 'Passwords do not match'
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    try {
      const payload: RegisterPayload = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        password: formData.password,
        userName: formData.userName,
        role: 'INVESTOR',
      }
      await register(payload)
      navigate({ to: '/' })
    } catch (err) {
      console.error('Registration failed:', err)
    }
  }

  const fields = [
    {
      name: 'name',
      placeholder: 'Full name',
      type: 'text',
      icon: User,
      label: 'Full Name',
    },
    {
      name: 'userName',
      placeholder: 'Username',
      type: 'text',
      icon: User,
      label: 'Username',
    },
    {
      name: 'phoneNumber',
      placeholder: 'Phone number',
      type: 'tel',
      icon: Phone,
      label: 'Phone Number',
    },
    {
      name: 'email',
      placeholder: 'Email address',
      type: 'email',
      icon: Mail,
      label: 'Email',
    },
    {
      name: 'address',
      placeholder: 'House address',
      type: 'text',
      icon: MapPin,
      label: 'Address',
    },
  ]

  const TheSignupForm = (
    <div>
      {error && (
        <div className="mb-4 p-3.5 bg-red-50 border border-red-100 rounded-xl">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {fields.map(({ name, placeholder, type, icon: Icon, label }) => (
          <div key={name}>
            <Label
              htmlFor={name}
              className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              {label}
            </Label>
            <div className="relative mt-1.5">
              <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
              <Input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={formData[name as keyof typeof formData]}
                onChange={handleChange}
                disabled={isLoading}
                className={`pl-10 py-5 ${validationErrors[name] ? 'border-red-400' : ''}`}
              />
            </div>
            {validationErrors[name] && (
              <p className="text-xs text-red-500 mt-1">
                {validationErrors[name]}
              </p>
            )}
          </div>
        ))}

        <div>
          <Label
            htmlFor="password"
            className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Password
          </Label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
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
            <p className="text-xs text-red-500 mt-1">
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
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              className={`pl-10 pr-11 py-5 ${validationErrors.confirmPassword ? 'border-red-400' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((p) => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {validationErrors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">
              {validationErrors.confirmPassword}
            </p>
          )}
        </div>

        <div className="pt-1">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-light text-white py-5 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            {isLoading ? (
              'Creating account...'
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        <p className="text-sm text-center text-gray-400 pt-1">
          Already have an account?{' '}
          <Link to="/" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )

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
              <span className="text-white/70 text-xs">Join the network</span>
            </div>
            <h1 className="text-3xl font-bold text-white leading-tight tracking-tight">
              Start earning <span className="text-primary">from day one.</span>
            </h1>
            <div className="flex gap-5 mt-4">
              {[
                { v: 'Free', l: 'To Join' },
                { v: '12K+', l: 'Members' },
                { v: '<1min', l: 'Setup' },
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create account</h2>
            <p className="text-gray-500 text-sm mt-1">
              Fill in your details to get started
            </p>
          </div>
          {TheSignupForm}
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
                <span className="text-white/60 text-xs">Join the network</span>
              </div>
              <h1 className="text-4xl font-bold text-white leading-[1.1] tracking-tight">
                Start earning
                <br />
                <span className="text-primary">from day one.</span>
              </h1>
              <p className="text-white/35 mt-3 text-sm leading-relaxed max-w-xs">
                Create your account in minutes. Unlock your first level and
                start building your earnings network today.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  step: '01',
                  title: 'Create your account',
                  desc: 'Fill in your details and verify your email',
                },
                {
                  step: '02',
                  title: 'Fund your wallet',
                  desc: 'Add funds to unlock your earning level',
                },
                {
                  step: '03',
                  title: 'Start earning',
                  desc: 'Refer members and earn on every level',
                },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-3 items-start">
                  <span className="text-xs font-bold text-primary/60 mt-0.5 w-5 shrink-0">
                    {step}
                  </span>
                  <div>
                    <p className="text-white text-sm font-semibold leading-none">
                      {title}
                    </p>
                    <p className="text-white/30 text-xs mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <Ticker dark={true} />
          </div>
        </div>

        <div className="flex-1 flex items-start justify-center px-10 bg-white overflow-y-auto">
          <div className="w-full max-w-sm py-10">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-gray-900">
                Create account
              </h2>
              <p className="text-gray-500 text-sm mt-1.5">
                Fill in your details to get started
              </p>
            </div>
            {TheSignupForm}
          </div>
        </div>
      </div>
    </div>
  )
}
