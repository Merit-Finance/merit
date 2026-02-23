import { createFileRoute, Link } from '@tanstack/react-router'
import { MeritLogo } from '@/assets'
import { Mail, ArrowRight, ArrowLeft, SendHorizonal } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authService } from '@/services/auth.service'

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
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

function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setEmailError('Email is required')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Enter a valid email')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      await authService.resetPassword(email)
      setSent(true)
    } catch {
      setError('Could not send reset link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const renderForm = () => {
    if (sent) {
      return (
        <div className="flex flex-col items-center text-center gap-5 py-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <SendHorizonal className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Check your inbox
            </h3>
            <p className="text-sm text-gray-500 mt-1 max-w-xs">
              We sent a password reset link to{' '}
              <span className="font-semibold text-gray-700">{email}</span>.
              Click the link in the email to set a new password.
            </p>
          </div>
          <p className="text-xs text-gray-400">
            Didn't get it?{' '}
            <button
              type="button"
              onClick={() => setSent(false)}
              className="text-primary hover:underline font-semibold"
            >
              Resend
            </button>
          </p>
          <Link
            to="/"
            className="text-sm text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </Link>
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
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (emailError) setEmailError(null)
                if (error) setError(null)
              }}
              disabled={isLoading}
              className={`pl-10 py-5 ${emailError ? 'border-red-400' : ''}`}
            />
          </div>
          {emailError && (
            <p className="text-xs text-red-500 mt-1.5">{emailError}</p>
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
              <span>Send Reset Link</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
        <p className="text-center text-sm text-gray-400 pt-1">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </Link>
        </p>
      </form>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Mobile */}
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
                Secure password recovery
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white leading-tight tracking-tight">
              Forgot your <span className="text-primary">password?</span>
            </h1>
            <p className="text-white/40 mt-2 text-sm">
              No worries — we'll send a reset link straight to your inbox.
            </p>
          </div>
        </div>
        <Ticker dark={false} />
        <div className="flex-1 bg-white px-6 pt-8 pb-12">
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-gray-900">
              {sent ? 'Email sent!' : 'Reset password'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {sent
                ? 'Check your inbox for the reset link.'
                : "Enter your email and we'll send you a reset link."}
            </p>
          </div>
          {renderForm()}
        </div>
      </div>

      {/* Desktop */}
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
                  {sent ? 'Link sent!' : 'Secure password recovery'}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-white leading-[1.1] tracking-tight">
                {sent ? (
                  <>
                    Check your <br />
                    <span className="text-primary">inbox.</span>
                  </>
                ) : (
                  <>
                    Forgot your <br />
                    <span className="text-primary">password?</span>
                  </>
                )}
              </h1>
              <p className="text-white/35 mt-3 text-sm leading-relaxed max-w-xs">
                {sent
                  ? `We sent a reset link to ${email}. Click it to create a new password.`
                  : "No worries. Enter your email and we'll send a reset link straight to your inbox."}
              </p>
            </div>

            {!sent && (
              <div className="space-y-3">
                {[
                  {
                    step: '01',
                    title: 'Enter your email',
                    desc: "We'll verify it belongs to you",
                  },
                  {
                    step: '02',
                    title: 'Click the link',
                    desc: 'Open the email and click reset',
                  },
                  {
                    step: '03',
                    title: 'Set new password',
                    desc: 'Create a strong new password',
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
            )}

            {sent && (
              <div className="flex gap-3 items-center bg-white/5 border border-white/8 rounded-xl p-4">
                <SendHorizonal className="w-7 h-7 text-primary shrink-0" />
                <div>
                  <p className="text-white text-sm font-semibold">
                    Reset link sent
                  </p>
                  <p className="text-white/30 text-xs mt-0.5">
                    Check your spam folder if you don't see it
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="relative z-10">
            <Ticker dark={true} />
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex items-center justify-center px-16 bg-white overflow-y-auto">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Password Recovery
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {sent ? 'Email sent!' : 'Reset password'}
              </h2>
              <p className="text-gray-500 text-sm mt-1.5">
                {sent
                  ? 'Check your inbox for the reset link.'
                  : "Enter your email and we'll send you a reset link."}
              </p>
            </div>
            {renderForm()}
          </div>
        </div>
      </div>
    </div>
  )
}
