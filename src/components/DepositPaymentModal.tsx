import * as Dialog from '@radix-ui/react-dialog'
import { X, Copy, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PaymentData } from './InsuffucientBalanceDialog'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  payment: PaymentData
}

function useCountdown(validUntil: string) {
  const getSecondsLeft = () => {
    const diff = new Date(validUntil).getTime() - Date.now()
    return Math.max(0, Math.floor(diff / 1000))
  }

  const [secondsLeft, setSecondsLeft] = useState(getSecondsLeft)

  useEffect(() => {
    if (secondsLeft <= 0) return
    const interval = setInterval(() => {
      setSecondsLeft(getSecondsLeft())
    }, 1000)
    return () => clearInterval(interval)
  }, [validUntil])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const isExpired = secondsLeft === 0
  const isUrgent = secondsLeft <= 60

  return { minutes, seconds, secondsLeft, isExpired, isUrgent }
}

export function DepositPaymentModal({ open, onOpenChange, payment }: Props) {
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [copiedAmount, setCopiedAmount] = useState(false)
  const { minutes, seconds, isExpired, isUrgent } = useCountdown(
    payment.valid_until,
  )

  const copyAddress = () => {
    navigator.clipboard.writeText(payment.pay_address)
    setCopiedAddress(true)
    setTimeout(() => setCopiedAddress(false), 2000)
  }

  const copyAmount = () => {
    navigator.clipboard.writeText(payment.pay_amount.toString())
    setCopiedAmount(true)
    setTimeout(() => setCopiedAmount(false), 2000)
  }

  const pad = (n: number) => String(n).padStart(2, '0')

  // Countdown circle progress
  const totalSeconds = 10 * 60 // 10 min default
  const progress = Math.min((seconds + minutes * 60) / totalSeconds, 1)
  const circumference = 2 * Math.PI * 28
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-900 px-6 pt-6 pb-8 relative">
            <Dialog.Close className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </Dialog.Close>

            <Dialog.Title className="text-white font-bold text-base mb-0.5">
              Complete Your Payment
            </Dialog.Title>
            <Dialog.Description className="text-white/50 text-xs">
              Send the exact amount to the address below
            </Dialog.Description>

            {/* Countdown */}
            <div className="flex items-center justify-center mt-5">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 64 64">
                  {/* Background circle */}
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="4"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke={
                      isExpired ? '#ef4444' : isUrgent ? '#f97316' : '#149AEE'
                    }
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {isExpired ? (
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  ) : (
                    <>
                      <span
                        className={`text-lg font-bold leading-none ${isUrgent ? 'text-orange-400' : 'text-white'}`}
                      >
                        {pad(minutes)}:{pad(seconds)}
                      </span>
                      <span className="text-white/40 text-[9px] mt-0.5">
                        remaining
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {isExpired && (
              <p className="text-red-400 text-xs text-center mt-3 font-medium">
                This payment has expired. Please generate a new one.
              </p>
            )}
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4 -mt-3">
            {/* Amount to send */}
            <div className="bg-gray-50 border border-[#E8E8E8] rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Send exactly this amount
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900 font-bold text-xl leading-none">
                    {payment.pay_amount.toFixed(6)}
                  </p>
                  <p className="text-blue-500 text-xs font-semibold uppercase mt-0.5">
                    {payment.pay_currency}
                  </p>
                </div>
                <button
                  onClick={copyAmount}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    copiedAmount
                      ? 'bg-green-50 text-green-600 border border-green-100'
                      : 'bg-white border border-[#E8E8E8] text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {copiedAmount ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>
              <p className="text-gray-400 text-xs mt-2 border-t border-gray-200 pt-2">
                ≈ ${payment.price_amount.toFixed(2)} USD
              </p>
            </div>

            {/* Payment Address */}
            <div>
              <p className="text-xs font-medium text-gray-700 mb-1.5">
                Payment Address
              </p>
              <div className="bg-gray-50 border border-[#E8E8E8] rounded-xl p-3 flex items-center gap-3">
                <p className="text-xs text-gray-700 font-mono truncate flex-1 select-all">
                  {payment.pay_address}
                </p>
                <button
                  onClick={copyAddress}
                  className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    copiedAddress
                      ? 'bg-green-50 text-green-600 border border-green-100'
                      : 'bg-white border border-[#E8E8E8] text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {copiedAddress ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Details row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 border border-[#E8E8E8] rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Network</p>
                <p className="text-gray-900 font-bold text-sm uppercase">
                  {payment.network}
                </p>
              </div>
              <div className="bg-gray-50 border border-[#E8E8E8] rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">Payment ID</p>
                <p className="text-gray-900 font-bold text-sm font-mono truncate">
                  {payment.payment_id}
                </p>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-amber-700 text-xs leading-relaxed">
                Send only{' '}
                <span className="font-bold uppercase">
                  {payment.pay_currency}
                </span>{' '}
                on the{' '}
                <span className="font-bold uppercase">{payment.network}</span>{' '}
                network. Sending any other asset may result in permanent loss of
                funds.
              </p>
            </div>

            <button
              onClick={() => onOpenChange(false)}
              className="w-full flex cursor-pointer items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              I've Sent the Payment
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
