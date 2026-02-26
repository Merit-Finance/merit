import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { MeritLogo } from '@/assets'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { authService } from '@/services/auth.service'

export const Route = createFileRoute('/verify')({
  component: VerifyEmailPage,
})

type Status = 'loading' | 'success' | 'error'

function VerifyEmailPage() {
  const [status, setStatus] = useState<Status>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token')

    if (!token) {
      setErrorMessage(
        'No verification token found. Please use the link from your email.',
      )
      setStatus('error')
      return
    }

    authService
      .verifyEmail(token)
      .then(() => setStatus('success'))
      .catch((err: Error) => {
        setErrorMessage(
          err.message ?? 'This link may have expired or already been used.',
        )
        setStatus('error')
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-10">
        <MeritLogo className="h-7 w-7 text-[#008FE9]" />
        <span className="text-gray-900 font-semibold text-xl">
          Merit Finance
        </span>
      </div>

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        {/* Loading */}
        {status === 'loading' && (
          <>
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Verifying your email
            </h1>
            <p className="text-sm text-gray-500">Please wait a moment...</p>
          </>
        )}

        {/* Success */}
        {status === 'success' && (
          <>
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Email verified!
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Your account is now active. You can sign in and start earning.
            </p>
            <Button
              asChild
              className="w-full bg-primary hover:bg-primary-light text-white py-5 rounded-xl font-semibold"
            >
              <Link to="/login">Go to Sign In</Link>
            </Button>
          </>
        )}

        {/* Error */}
        {status === 'error' && (
          <>
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Verification failed
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              {errorMessage ||
                'This link may have expired or already been used.'}
            </p>
            <div className="space-y-2.5">
              <Button
                asChild
                className="w-full bg-primary hover:bg-primary-light text-white py-5 rounded-xl font-semibold"
              >
                <Link to="/signup">Back to Sign Up</Link>
              </Button>
              <p className="text-xs text-gray-400">
                Already verified?{' '}
                <Link
                  to="/login"
                  className="text-primary font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
