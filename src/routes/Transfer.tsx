import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import { ArrowLeft, Search, AlertTriangle, CheckCircle2, X } from 'lucide-react'
import { userService } from '@/services/users.service'
import { transactionService } from '@/services/transaction.service'
import { useBalanceStore } from '@/stores/balance.store'
import { PinModal } from '@/components/PinModal'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/Transfer')({
  component: TransferPage,
})

interface RecipientUser {
  id: string
  name: string
  email: string
  userName: string
  wallet: { address: string }[]
}

function TransferPage() {
  const navigate = useNavigate()
  const { mainBalance, fetchMainBalance } = useBalanceStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [recipient, setRecipient] = useState<RecipientUser | null>(null)

  const [amount, setAmount] = useState('')
  const [amountError, setAmountError] = useState<string | null>(null)

  const [pinOpen, setPinOpen] = useState(false)
  const [pinError, setPinError] = useState<string | null>(null)
  const [isTransferring, setIsTransferring] = useState(false)

  const [isSuccess, setIsSuccess] = useState(false)

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setSearchError(null)

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)

    if (!value.trim()) {
      setRecipient(null)
      return
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true)
      try {
        const response = await userService.searchByIdentifier(value.trim())
        if (response.success && response.data) {
          setRecipient(response.data)
          setSearchError(null)
        } else {
          setRecipient(null)
          setSearchError('User not found')
        }
      } catch (err: any) {
        setRecipient(null)
        setSearchError(
          err?.response?.data?.message ||
            'User not found. Check the email or username.',
        )
      } finally {
        setIsSearching(false)
      }
    }, 600)
  }

  const handleClearRecipient = () => {
    setRecipient(null)
    setSearchQuery('')
    setSearchError(null)
    setAmount('')
    setAmountError(null)
  }

  const handleAmountChange = (value: string) => {
    setAmount(value)
    setAmountError(null)

    const numeric = parseFloat(value)
    if (isNaN(numeric) || numeric <= 0) {
      setAmountError('Enter a valid amount')
      return
    }
    if (mainBalance !== null && numeric > mainBalance) {
      setAmountError('Insufficient balance')
    }
  }

  const handleContinue = () => {
    const numeric = parseFloat(amount)
    if (!recipient) return
    if (isNaN(numeric) || numeric <= 0) {
      setAmountError('Enter a valid amount')
      return
    }
    if (mainBalance !== null && numeric > mainBalance) {
      setAmountError('Insufficient balance')
      return
    }
    setPinError(null)
    setPinOpen(true)
  }

  const handlePinConfirm = async (pin: string) => {
    if (!recipient) return
    const numeric = parseFloat(amount)

    setIsTransferring(true)
    setPinError(null)

    try {
      const response = await transactionService.internalTransfer({
        recipientId: recipient.id,
        amount: numeric,
        pin,
      })

      if (response.success) {
        setPinOpen(false)
        setIsSuccess(true)
        fetchMainBalance()
      } else {
        setPinError('Transfer failed. Please try again.')
      }
    } catch (err: any) {
      setPinError(
        err?.response?.data?.message ||
          'Transfer failed. Please check your PIN.',
      )
    } finally {
      setIsTransferring(false)
    }
  }

  const handleNewTransfer = () => {
    setIsSuccess(false)
    setRecipient(null)
    setSearchQuery('')
    setAmount('')
    setAmountError(null)
    setSearchError(null)
  }

  const numericAmount = parseFloat(amount)
  const isAmountValid =
    !isNaN(numericAmount) &&
    numericAmount > 0 &&
    mainBalance !== null &&
    numericAmount <= mainBalance

  const walletAddress = recipient?.wallet?.[0]?.address ?? null
  const shortWallet = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : null

  if (isSuccess) {
    return (
      <div className="max-w-lg mx-auto w-full flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            Transfer Successful!
          </h2>
          <p className="text-gray-400 text-sm">
            ${numericAmount.toFixed(2)} was sent to{' '}
            <span className="font-medium text-gray-700">
              {recipient?.name ?? recipient?.userName}
            </span>
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={handleNewTransfer}
            className="w-full bg-primary hover:bg-primary-light text-white py-3 rounded-xl font-semibold text-sm transition-colors"
          >
            New Transfer
          </button>
          <button
            onClick={() => navigate({ to: '/dashboard' })}
            className="w-full border border-[#E8E8E8] text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex max-w-4xl items-center gap-3">
        <button
          onClick={() => navigate({ to: '/dashboard' })}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Transfer</h1>
      </div>
      <div className="max-w-xl mx-auto w-full space-y-6 px-0 sm:px-4">
        <div className="flex justify-end">
          <span className="text-xs text-gray-400 bg-gray-50 border border-[#E8E8E8] px-3 py-1 rounded-full">
            Available: $
            {(mainBalance ?? 0).toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E8E8E8] space-y-3">
          <label className="text-sm font-semibold text-gray-700">
            Recipient
          </label>

          {recipient ? (
            <div className="flex items-center justify-between p-4 border border-[#E8E8E8] rounded-xl bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {(recipient.name ??
                    recipient.userName ??
                    'U')[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-gray-900 font-semibold text-sm">
                    {recipient.name ?? recipient.userName}
                  </p>
                  <p className="text-gray-400 text-xs">{recipient.email}</p>
                  {shortWallet && (
                    <p className="text-gray-400 text-xs font-mono">
                      {shortWallet}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleClearRecipient}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                {isSearching ? (
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by email or username..."
                className="pl-9"
              />
            </div>
          )}

          {searchError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-red-600 text-xs">{searchError}</p>
            </div>
          )}
        </div>
      </div>
      {recipient && (
        <div className="bg-white rounded-2xl p-5 border border-[#E8E8E8] space-y-3">
          <label className="text-sm font-semibold text-gray-700">Amount</label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg z-10">
              $
            </span>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.00"
              className={`pl-7 text-2xl font-bold ${amountError ? 'border-red-400 bg-red-50 focus-visible:ring-red-400' : ''}`}
            />
          </div>

          {amountError === 'Insufficient balance' ? (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-red-600 text-xs">
                Insufficient balance. You have ${(mainBalance ?? 0).toFixed(2)}{' '}
                available.
              </p>
            </div>
          ) : amountError ? (
            <p className="text-red-500 text-xs">{amountError}</p>
          ) : null}

          <div className="flex gap-2 flex-wrap">
            {[10, 20, 50, 100].map((preset) => (
              <button
                key={preset}
                onClick={() => handleAmountChange(String(preset))}
                disabled={mainBalance !== null && preset > mainBalance}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#E8E8E8] text-gray-600 hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ${preset}
              </button>
            ))}
          </div>
        </div>
      )}

      {recipient && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-amber-700 text-xs">
            Please crosscheck details, funds sent to a wrong recipient cannot be
            recovered.
          </p>
        </div>
      )}

      {recipient && (
        <button
          onClick={handleContinue}
          disabled={!isAmountValid}
          className="w-full bg-primary hover:bg-primary-light disabled:bg-gray-200 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold text-sm transition-colors"
        >
          Continue
        </button>
      )}

      <PinModal
        open={pinOpen}
        onOpenChange={setPinOpen}
        onConfirm={handlePinConfirm}
        isLoading={isTransferring}
        error={pinError}
        recipientName={recipient?.name ?? recipient?.userName ?? ''}
        amount={numericAmount || 0}
      />
    </div>
  )
}
