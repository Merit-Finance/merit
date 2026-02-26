import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { MeritLogo } from '@/assets'
import { CheckCircle2, XCircle, Loader2, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { transactionService } from '@/services/transaction.service'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { REGEXP_ONLY_DIGITS } from 'input-otp'

export const Route = createFileRoute('/reset-transfer-pin')({
  component: ResetTransferPinPage,
})

type Status = 'idle' | 'loading' | 'success' | 'error'

function ResetTransferPinPage() {
  const [token, setToken] = useState<string | null>(null)
  const [newPin, setNewPin] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('token')
    if (!t) {
      setErrorMessage(
        'No reset token found. Please use the link from your email.',
      )
      setStatus('error')
    } else {
      setToken(t)
    }
  }, [])

  const handleSubmit = async () => {
    if (!token || newPin.length !== 4) return
    setStatus('loading')
    setErrorMessage('')
    try {
      await transactionService.confirmPinReset(token, newPin)
      setStatus('success')
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message ??
          'This link may have expired or already been used.',
      )
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="flex items-center gap-2.5 mb-10">
        <MeritLogo className="h-7 w-7 text-[#008FE9]" />
        <span className="text-gray-900 font-semibold text-xl">
          Merit Finance
        </span>
      </div>

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        {status === 'error' && (
          <>
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Reset failed
            </h1>
            <p className="text-sm text-gray-500 mb-6">{errorMessage}</p>
            <Button
              asChild
              className="w-full bg-primary hover:bg-primary-light text-white py-5 rounded-xl font-semibold"
            >
              <Link to="/login">Back to Sign In</Link>
            </Button>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              PIN updated!
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Your transaction PIN has been set successfully. You can now use it
              for transfers and withdrawals.
            </p>
            <Button
              asChild
              className="w-full bg-primary hover:bg-primary-light text-white py-5 rounded-xl font-semibold"
            >
              <Link to="/">Go to App</Link>
            </Button>
          </>
        )}

        {(status === 'idle' || status === 'loading') && token && (
          <>
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                <KeyRound className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Set your transaction PIN
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Enter a new 4-digit PIN. You'll use this to confirm transfers and
              withdrawals.
            </p>

            <div className="flex justify-center mb-6">
              <InputOTP
                maxLength={4}
                pattern={REGEXP_ONLY_DIGITS}
                value={newPin}
                onChange={setNewPin}
              >
                <InputOTPGroup className="gap-3">
                  <InputOTPSlot
                    index={0}
                    className="w-12 h-12 text-lg border-[#E8E8E8] rounded-xl"
                  />
                  <InputOTPSlot
                    index={1}
                    className="w-12 h-12 text-lg border-[#E8E8E8] rounded-xl"
                  />
                  <InputOTPSlot
                    index={2}
                    className="w-12 h-12 text-lg border-[#E8E8E8] rounded-xl"
                  />
                  <InputOTPSlot
                    index={3}
                    className="w-12 h-12 text-lg border-[#E8E8E8] rounded-xl"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={newPin.length !== 4 || status === 'loading'}
              className="w-full bg-primary hover:bg-primary-light disabled:bg-gray-300 text-white py-5 rounded-xl font-semibold"
            >
              {status === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                'Set PIN'
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
