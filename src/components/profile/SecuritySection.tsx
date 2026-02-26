import { useState, useRef, useEffect } from 'react'
import {
  KeyRound,
  ShieldCheck,
  XCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { authService } from '@/services/auth.service'
import { transactionService } from '@/services/transaction.service'
import { Input } from '@/components/ui/input'
import { PasswordField } from './PasswordField'
import { useUserStore } from '@/stores/user.store'

function PinRow({
  label,
  pin,
  onChange,
  disabled,
  hasError,
}: {
  label: string
  pin: string[]
  onChange: (pin: string[]) => void
  disabled?: boolean
  hasError?: boolean
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const next = [...pin]
    next[index] = value.slice(-1)
    onChange(next)
    if (value && index < 3) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 4)
    const next = ['', '', '', '']
    pasted.split('').forEach((c, i) => {
      next[i] = c
    })
    onChange(next)
    const firstEmpty = next.findIndex((v) => !v)
    inputRefs.current[firstEmpty === -1 ? 3 : firstEmpty]?.focus()
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <div className="flex gap-2">
        {pin.map((digit, i) => (
          <Input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el
            }}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={[
              'w-12 h-12 text-center text-xl font-bold px-0',
              digit ? 'border-primary bg-blue-50' : '',
              hasError ? 'border-red-400 bg-red-50' : '',
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  )
}

export function SecuritySection() {
  const { userData, fetchUser } = useUserStore()
  const hasSetPin = userData?.hasSetPin ?? false

  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  const [showPinForm, setShowPinForm] = useState(false)

  const [newPin, setNewPin] = useState(['', '', '', ''])
  const [confirmPin, setConfirmPin] = useState(['', '', '', ''])
  const [pinLoading, setPinLoading] = useState(false)
  const [pinError, setPinError] = useState<string | null>(null)
  const [pinSuccess, setPinSuccess] = useState(false)

  const [pinResetPassword, setPinResetPassword] = useState('')
  const [pinResetLoading, setPinResetLoading] = useState(false)
  const [pinResetError, setPinResetError] = useState<string | null>(null)
  const [pinResetSuccess, setPinResetSuccess] = useState(false)

  useEffect(() => {
    if (!showPinForm) {
      setNewPin(['', '', '', ''])
      setConfirmPin(['', '', '', ''])
      setPinError(null)
      setPinSuccess(false)
      setPinResetPassword('')
      setPinResetError(null)
      setPinResetSuccess(false)
    }
  }, [showPinForm])

  const handleChangePassword = async () => {
    setPasswordLoading(true)
    setPasswordError(null)
    setPasswordSuccess(false)
    try {
      await authService.changePassword({ currentPassword, newPassword })
      setPasswordSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setTimeout(() => {
        setShowPasswordForm(false)
        setPasswordSuccess(false)
      }, 2000)
    } catch (err: any) {
      setPasswordError(
        err.response?.data?.message || 'Failed to change password.',
      )
    } finally {
      setPasswordLoading(false)
    }
  }

  const pinComplete = newPin.every(Boolean) && confirmPin.every(Boolean)

  const handleCreatePin = async () => {
    if (newPin.join('') !== confirmPin.join('')) {
      setPinError('PINs do not match. Please try again.')
      setConfirmPin(['', '', '', ''])
      return
    }
    setPinLoading(true)
    setPinError(null)
    try {
      await transactionService.setTransferPin(newPin.join(''))
      setPinSuccess(true)
      setNewPin(['', '', '', ''])
      setConfirmPin(['', '', '', ''])
      fetchUser()
      setTimeout(() => {
        setShowPinForm(false)
        setPinSuccess(false)
      }, 2000)
    } catch (err: any) {
      setPinError(err.response?.data?.message || 'Failed to create PIN.')
    } finally {
      setPinLoading(false)
    }
  }

  const handleRequestPinReset = async () => {
    if (!pinResetPassword.trim()) return
    setPinResetLoading(true)
    setPinResetError(null)
    try {
      await transactionService.requestPinReset(pinResetPassword.trim())
      setPinResetSuccess(true)
      setPinResetPassword('')
    } catch (err: any) {
      setPinResetError(
        err.response?.data?.message ||
          'Failed to send reset email. Check your password.',
      )
    } finally {
      setPinResetLoading(false)
    }
  }

  const pinLabel = hasSetPin ? 'Change PIN' : 'Set New PIN'

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] space-y-3">
      <h2 className="text-gray-900 font-semibold text-base">Security</h2>

      {!showPasswordForm ? (
        <button
          onClick={() => setShowPasswordForm(true)}
          className="w-full flex items-center gap-3 px-4 py-3 border border-[#E8E8E8] rounded-xl hover:bg-gray-50 transition-colors text-left"
        >
          <KeyRound className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700 font-medium">
            Change Password
          </span>
        </button>
      ) : (
        <div className="border border-[#E8E8E8] rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700 font-medium">
                Change Password
              </span>
            </div>
            <button
              onClick={() => {
                setShowPasswordForm(false)
                setCurrentPassword('')
                setNewPassword('')
                setPasswordError(null)
              }}
              className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
          <PasswordField
            label="Current Password"
            value={currentPassword}
            onChange={setCurrentPassword}
            show={showCurrent}
            onToggle={() => setShowCurrent((p) => !p)}
          />
          <PasswordField
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            show={showNew}
            onToggle={() => setShowNew((p) => !p)}
          />
          {passwordError && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {passwordError}
            </p>
          )}
          {passwordSuccess && (
            <p className="text-xs text-green-600 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
              Password changed successfully!
            </p>
          )}
          <button
            onClick={handleChangePassword}
            disabled={passwordLoading || !currentPassword || !newPassword}
            className="w-full cursor-pointer bg-primary hover:bg-primary-light disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {passwordLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Update Password'
            )}
          </button>
        </div>
      )}

      {/* ── Create / Change Transfer PIN ── */}
      {!showPinForm ? (
        <button
          onClick={() => setShowPinForm(true)}
          className="w-full flex items-center gap-3 px-4 py-3 border border-[#E8E8E8] rounded-xl hover:bg-gray-50 transition-colors text-left"
        >
          <ShieldCheck className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700 font-medium">{pinLabel}</span>
        </button>
      ) : (
        <div className="border border-[#E8E8E8] rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700 font-medium">
                {pinLabel}
              </span>
            </div>
            <button
              onClick={() => setShowPinForm(false)}
              className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>

          {/* Flow A — no PIN yet: show PIN boxes */}
          {!hasSetPin && (
            <>
              <PinRow
                label="New PIN"
                pin={newPin}
                onChange={setNewPin}
                disabled={pinLoading}
                hasError={!!pinError}
              />
              <PinRow
                label="Confirm PIN"
                pin={confirmPin}
                onChange={setConfirmPin}
                disabled={pinLoading}
                hasError={!!pinError}
              />
              {pinError && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {pinError}
                </p>
              )}
              {pinSuccess && (
                <p className="text-xs text-green-600 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                  Transfer PIN created successfully!
                </p>
              )}
              <button
                onClick={handleCreatePin}
                disabled={pinLoading || !pinComplete}
                className="w-full cursor-pointer bg-primary hover:bg-primary-light disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {pinLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Create PIN'
                )}
              </button>
            </>
          )}

          {/* Flow B — PIN already set: send reset email via password */}
          {hasSetPin && (
            <>
              <p className="text-sm text-gray-500">
                Enter your account password and we'll send a PIN reset link to
                your email.
              </p>
              {pinResetSuccess ? (
                <div className="flex items-start gap-2.5 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700">
                    Check your email for the PIN reset link.
                  </p>
                </div>
              ) : (
                <>
                  <Input
                    type="password"
                    placeholder="Enter your account password"
                    value={pinResetPassword}
                    onChange={(e) => {
                      setPinResetPassword(e.target.value)
                      setPinResetError(null)
                    }}
                  />
                  {pinResetError && (
                    <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                      {pinResetError}
                    </p>
                  )}
                  <button
                    onClick={handleRequestPinReset}
                    disabled={!pinResetPassword.trim() || pinResetLoading}
                    className="w-full cursor-pointer bg-primary hover:bg-primary-light disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {pinResetLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
