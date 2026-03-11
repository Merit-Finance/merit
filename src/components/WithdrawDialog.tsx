import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { X, AlertTriangle, Wallet, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useUserStore } from '@/stores/user.store'
import { transactionService } from '@/services/transaction.service'
import { Network } from '@/lib/transaction'
import { useNavigate } from '@tanstack/react-router'

interface WithdrawDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  availableBalance?: number
  minWithdrawal?: number
  onSuccess?: () => void
}

const MIN_WITHDRAWAL = Number(import.meta.env.VITE_MIN_WITHDRAWAL) || 1

export function WithdrawDialog({
  open,
  onOpenChange,
  availableBalance = 0,
  minWithdrawal = MIN_WITHDRAWAL,
  onSuccess,
}: WithdrawDialogProps) {
  const { userData } = useUserStore()
  const navigate = useNavigate()
  const savedWallets = userData?.wallet ?? []

  const [amount, setAmount] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [network, setNetwork] = useState<Network>('BSC')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const numAmount = parseFloat(amount) || 0
  const hasZeroBalance = availableBalance <= 0
  const belowMin = numAmount > 0 && numAmount < minWithdrawal
  const exceedsBalance =
    parseFloat(numAmount.toFixed(2)) > parseFloat(availableBalance.toFixed(2))
  const hasNoWallets = savedWallets.length === 0
  const canConfirm =
    !hasZeroBalance &&
    !hasNoWallets &&
    numAmount >= minWithdrawal &&
    !exceedsBalance &&
    walletAddress.trim().length > 0 &&
    !loading

  const handleSelectSavedWallet = (wallet: string, net: Network) => {
    setWalletAddress(wallet)
    setNetwork(net)
  }

  const handleConfirm = async () => {
    if (!canConfirm) return
    setLoading(true)
    setError(null)
    try {
      await transactionService.withdraw({
        amount: parseFloat(amount),
        network,
        address: walletAddress.trim(),
      })
      setSuccess(true)
      setAmount('')
      setWalletAddress('')
      setNetwork('BSC')
      onSuccess?.()
      setTimeout(() => {
        setSuccess(false)
        onOpenChange(false)
      }, 2000)
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Withdrawal failed. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  const handleClose = (val: boolean) => {
    if (loading) return
    setAmount('')
    setWalletAddress('')
    setNetwork('BSC')
    setError(null)
    setSuccess(false)
    onOpenChange(val)
  }

  const handleGoToProfile = () => {
    handleClose(false)
    navigate({ to: '/profile' })
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-lg bg-white rounded-2xl shadow-xl p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <Dialog.Close
            disabled={loading}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </Dialog.Close>

          <Dialog.Title className="text-lg md:text-start text-center font-bold text-gray-900">
            Withdraw to USDT Wallet
          </Dialog.Title>
          <Dialog.Description className="text-sm md:text-start text-center text-gray-400 mt-0.5 mb-5">
            Enter the amount and select or enter your withdrawal wallet
          </Dialog.Description>

          {hasZeroBalance && (
            <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
              <p className="text-yellow-700 text-sm font-medium">
                You have no balance available to withdraw.
              </p>
            </div>
          )}

          {hasNoWallets ? (
            <div className="mb-5 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5 flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  No withdrawal wallet saved
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  You need to add a USDT wallet address in your profile before
                  you can withdraw funds.
                </p>
              </div>
              <button
                onClick={handleGoToProfile}
                className="flex items-center gap-1.5 bg-primary hover:bg-primary-light text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                Add Wallet in Profile
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                  Amount (USD)
                </label>
                <Input
                  type="number"
                  min={minWithdrawal}
                  max={availableBalance}
                  value={amount}
                  disabled={hasZeroBalance}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                />
                <p className="text-gray-400 text-xs mt-1.5">
                  Available: ${availableBalance.toFixed(2)} | Min: $
                  {minWithdrawal}
                </p>
                {belowMin && (
                  <p className="text-red-500 text-xs mt-1">
                    Minimum withdrawal is ${minWithdrawal}.
                  </p>
                )}
                {exceedsBalance && (
                  <p className="text-red-500 text-xs mt-1">
                    Amount exceeds your available balance.
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                  Select Saved Wallet
                </label>
                <div className="space-y-2">
                  {savedWallets.map((w: any, i: any) => {
                    const isSelected =
                      walletAddress === w.wallet && network === w.network
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() =>
                          handleSelectSavedWallet(
                            w.wallet,
                            w.network as Network,
                          )
                        }
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-primary bg-blue-50'
                            : 'border-[#E8E8E8] hover:bg-gray-50'
                        }`}
                      >
                        <Wallet
                          className={`w-4 h-4 shrink-0 ${isSelected ? 'text-primary' : 'text-gray-400'}`}
                        />
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-md shrink-0 ${
                            isSelected
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {w.network}
                        </span>
                        <span className="text-sm text-gray-700 truncate">
                          {w.wallet}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5">
            <div className="flex items-start gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-red-600 text-sm font-semibold">
                Important Warning
              </p>
            </div>
            <p className="text-red-500 text-xs leading-relaxed">
              Only withdraw to a valid USDT address on the selected network.
              Sending to the wrong network or incorrect address may result in{' '}
              <span className="font-bold">permanent loss of funds.</span>
            </p>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
              {error}
            </p>
          )}

          {success && (
            <p className="text-xs text-green-600 bg-green-50 border border-green-100 rounded-lg px-3 py-2 mb-4">
              Withdrawal submitted successfully!
            </p>
          )}

          {!hasNoWallets && (
            <button
              onClick={handleConfirm}
              disabled={!canConfirm}
              className="w-full bg-primary cursor-pointer hover:bg-primary-light disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing…
                </>
              ) : (
                'Confirm Withdrawal'
              )}
            </button>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
