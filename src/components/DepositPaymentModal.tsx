import * as Dialog from '@radix-ui/react-dialog'
import {
  X,
  Copy,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
  HelpCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { PaymentData } from './InsuffucientBalanceDialog'
import { transactionService } from '@/services/transaction.service'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  payment: PaymentData
}

type ConfirmView = 'idle' | 'confirming' | 'success'

function useCountdown(expiresAt: string) {
  const getSecondsLeft = () => {
    const diff = new Date(expiresAt).getTime() - Date.now()
    return Math.max(0, Math.floor(diff / 1000))
  }

  const [secondsLeft, setSecondsLeft] = useState(getSecondsLeft)

  useEffect(() => {
    if (secondsLeft <= 0) return
    const interval = setInterval(() => {
      setSecondsLeft(getSecondsLeft())
    }, 1000)
    return () => clearInterval(interval)
  }, [expiresAt])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const isExpired = secondsLeft === 0
  const isUrgent = secondsLeft <= 60

  return { minutes, seconds, secondsLeft, isExpired, isUrgent }
}

const EXPLORER_URLS: Record<string, string> = {
  BSC: 'https://bscscan.com/tx/',
  TRON: 'https://tronscan.org/#/transaction/',
}

export function DepositPaymentModal({ open, onOpenChange, payment }: Props) {
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [copiedAmount, setCopiedAmount] = useState(false)
  const [confirmView, setConfirmView] = useState<ConfirmView>('idle')
  const [txHash, setTxHash] = useState('')
  const [showTxHelp, setShowTxHelp] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmError, setConfirmError] = useState<string | null>(null)

  const { minutes, seconds, isExpired, isUrgent } = useCountdown(
    payment.expiresAt,
  )

  const copyAddress = () => {
    navigator.clipboard.writeText(payment.address)
    setCopiedAddress(true)
    setTimeout(() => setCopiedAddress(false), 2000)
  }

  const copyAmount = () => {
    navigator.clipboard.writeText(payment.totalPayable.toString())
    setCopiedAmount(true)
    setTimeout(() => setCopiedAmount(false), 2000)
  }

  const pad = (n: number) => String(n).padStart(2, '0')

  const totalSeconds = Math.floor(
    (new Date(payment.expiresAt).getTime() -
      new Date(payment.createdAt).getTime()) /
      1000,
  )
  const progress = Math.min((seconds + minutes * 60) / totalSeconds, 1)
  const circumference = 2 * Math.PI * 28
  const strokeDashoffset = circumference * (1 - progress)

  const explorerUrl = EXPLORER_URLS[payment.network.toUpperCase()]

  const handleConfirm = async () => {
    setIsSubmitting(true)
    setConfirmError(null)
    try {
      const result = await transactionService.confirmDeposit({
        referenceId: payment.referenceId,
        txHash,
        network: payment.network,
        asset: payment.asset,
      })
      if (result.success) {
        setConfirmView('success')
      } else {
        setConfirmError(
          result.message || 'Confirmation failed. Please try again.',
        )
      }
    } catch (err: any) {
      setConfirmError(
        err.response?.data?.message || 'Confirmation failed. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setConfirmView('idle')
    setTxHash('')
    setConfirmError(null)
    setShowTxHelp(false)
    onOpenChange(false)
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        if (!o) handleClose()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100vw-2rem)] max-w-md bg-white rounded-2xl shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 overflow-hidden flex flex-col max-h-[calc(100dvh-2rem)]">
          {/* ── Success state ── */}
          {confirmView === 'success' ? (
            <div className="px-6 py-10 flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-1">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                Deposit Submitted!
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                Your transaction is being verified on-chain. Your balance will
                update automatically once confirmed — this usually takes a few
                minutes.
              </p>
              <button
                onClick={handleClose}
                className="mt-4 w-full bg-primary hover:bg-primary-light text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* ── Header with timer ── */}
              <div className="bg-gray-900 px-6 pt-6 pb-8 relative shrink-0">
                <Dialog.Close className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </Dialog.Close>

                <Dialog.Title className="text-white font-bold text-base mb-0.5">
                  Complete Your Payment
                </Dialog.Title>
                <Dialog.Description className="text-white/50 text-xs">
                  Send the exact amount to the address below
                </Dialog.Description>

                <div className="flex items-center justify-center mt-5">
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 64 64">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="4"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke={
                          isExpired
                            ? '#ef4444'
                            : isUrgent
                              ? '#f97316'
                              : '#149AEE'
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

              <div className="px-6 py-5 space-y-4 -mt-3 overflow-y-auto">
                {/* Amount */}
                <div className="bg-gray-50 border border-[#E8E8E8] rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Send exactly this amount
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900 font-bold text-xl leading-none">
                        {payment.totalPayable.toFixed(2)}
                      </p>
                      <p className="text-blue-500 text-xs font-semibold uppercase mt-0.5">
                        {payment.asset}
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
                    ≈ ${payment.requestedAmount.toFixed(2)} USD · Fee: $
                    {payment.networkFee.toFixed(2)}
                  </p>
                </div>

                {/* Address */}
                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1.5">
                    Payment Address
                  </p>
                  <div className="bg-gray-50 border border-[#E8E8E8] rounded-xl p-3 flex items-center gap-3">
                    <p className="text-xs text-gray-700 font-mono truncate flex-1 select-all">
                      {payment.address}
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

                {/* Network / Ref */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 border border-[#E8E8E8] rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">Network</p>
                    <p className="text-gray-900 font-bold text-sm uppercase">
                      {payment.network}
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-[#E8E8E8] rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">Reference ID</p>
                    <p className="text-gray-900 font-bold text-sm font-mono truncate">
                      {payment.referenceId}
                    </p>
                  </div>
                </div>

                {/* Warning */}
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-amber-700 text-xs leading-relaxed">
                    Send only{' '}
                    <span className="font-bold uppercase">{payment.asset}</span>{' '}
                    on the{' '}
                    <span className="font-bold uppercase">
                      {payment.network}
                    </span>{' '}
                    network. Sending any other asset may result in permanent
                    loss of funds.
                  </p>
                </div>

                {/* ── Confirm section ── */}
                {confirmView === 'idle' && (
                  <button
                    onClick={() => setConfirmView('confirming')}
                    className="w-full flex cursor-pointer items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  >
                    I've Sent the Payment
                  </button>
                )}

                {confirmView === 'confirming' && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-medium text-gray-700">
                          Transaction Hash
                        </label>
                        <button
                          onClick={() => setShowTxHelp((v) => !v)}
                          className="flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-600 transition-colors"
                        >
                          <HelpCircle className="w-3 h-3" />
                          What's this?
                        </button>
                      </div>

                      {/* Contextual help */}
                      {showTxHelp && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-2 space-y-1.5">
                          <p className="text-xs text-blue-800 font-semibold">
                            How to find your Transaction Hash
                          </p>
                          <p className="text-xs text-blue-700 leading-relaxed">
                            After sending crypto from your wallet, every
                            transaction gets a unique ID called a{' '}
                            <span className="font-semibold">
                              Transaction Hash
                            </span>{' '}
                            (or TxID). It looks like:
                          </p>
                          <p className="text-[11px] font-mono bg-blue-100 text-blue-800 rounded-lg px-2 py-1.5 break-all">
                            0x4a3b2c1d...e9f8a7b6
                          </p>
                          <p className="text-xs text-blue-700 leading-relaxed">
                            Find it in your wallet app under{' '}
                            <span className="font-semibold">
                              Transaction History
                            </span>{' '}
                            → tap the transaction → copy the hash.
                          </p>
                          {explorerUrl && (
                            <a
                              href={explorerUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-semibold hover:underline"
                            >
                              View on {payment.network} Explorer
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      )}

                      <input
                        type="text"
                        value={txHash}
                        onChange={(e) => {
                          setTxHash(e.target.value)
                          setConfirmError(null)
                        }}
                        placeholder={
                          payment.network.toUpperCase() === 'TRON'
                            ? 'Paste your TxID here...'
                            : '0x... paste your transaction hash'
                        }
                        className="w-full text-xs font-mono border border-[#E8E8E8] rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-300"
                      />
                      <p className="text-[11px] text-gray-400 mt-1">
                        Paste the hash from your wallet after the transfer is
                        sent.
                      </p>
                    </div>

                    {confirmError && (
                      <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                        {confirmError}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setConfirmView('idle')
                          setTxHash('')
                          setConfirmError(null)
                          setShowTxHelp(false)
                        }}
                        className="flex-1 border border-[#E8E8E8] text-gray-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        disabled={txHash.trim().length < 20 || isSubmitting}
                        onClick={handleConfirm}
                        className="flex-1 bg-primary hover:bg-primary-light disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Confirming...
                          </>
                        ) : (
                          'Confirm Deposit'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
