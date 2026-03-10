import * as Dialog from '@radix-ui/react-dialog'
import { X, AlertTriangle, Wallet } from 'lucide-react'
import { useState } from 'react'
import apiClient from '@/lib/api-client'
import { DepositPaymentModal } from './DepositPaymentModal'
import { Input } from '@/components/ui/input'

type Network = 'BSC' | 'TRON'
type View = 'warning' | 'deposit'

export interface PaymentData {
  referenceId: string
  userId: string
  network: string
  asset: string
  address: string
  requestedAmount: number
  networkFee: number
  totalPayable: number
  expiresAt: string
  createdAt: string
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  required: number
  available: number
}

const MIN_DEPOSIT = 1
export function InsufficientBalanceDialog({
  open,
  onOpenChange,
  required,
  available,
}: Props) {
  const shortfall = required - available
  const [view, setView] = useState<View>('warning')
  const [amount, setAmount] = useState(shortfall.toFixed(2))
  const [network, setNetwork] = useState<Network>('BSC')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [paymentOpen, setPaymentOpen] = useState(false)

  const networks: Network[] = ['BSC', 'TRON']

  const resetAndClose = () => {
    setView('warning')
    setError(null)
    setAmount(shortfall.toFixed(2))
    setNetwork('BSC')
    onOpenChange(false)
  }

  const handleDeposit = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.post(
        '/custody/deposit-address',
        { network, asset: 'USDT', amount: parseFloat(amount) },
        { validateStatus: (status) => status < 500 },
      )

      if (response.data.success) {
        const raw = response.data.data
        setPaymentData({
          ...raw,
          networkFee: raw.networkFee ?? 0,
          totalPayable: raw.totalPayable ?? raw.requestedAmount,
        })
        setPaymentOpen(true)
        onOpenChange(false)
      } else {
        setError('Deposit failed. Please try again.')
      }
    } catch (err: any) {
      console.log('Error:', err)
      setError(
        err.response?.data?.message || 'Deposit failed. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Dialog.Root
        open={open}
        onOpenChange={(o) => {
          if (!o) resetAndClose()
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
            <Dialog.Close className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-4 h-4" />
            </Dialog.Close>

            {view === 'warning' && (
              <div>
                <div className="flex flex-col items-center text-center mb-5">
                  <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
                    <AlertTriangle className="w-7 h-7 text-red-500" />
                  </div>
                  <Dialog.Title className="text-lg font-bold text-gray-900">
                    Insufficient Balance
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-gray-400 mt-1">
                    You don't have enough balance to complete this upgrade.
                  </Dialog.Description>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Required Amount:</span>
                    <span className="text-gray-900 font-semibold">
                      ${required.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Your Balance:</span>
                    <span className="text-red-500 font-semibold">
                      ${available.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm border-t border-gray-200 pt-2">
                    <span className="text-gray-900 font-bold">Shortfall:</span>
                    <span className="text-red-500 font-bold">
                      ${shortfall.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5">
                  <p className="text-red-600 text-xs leading-relaxed">
                    Please top up your main balance by at least{' '}
                    <span className="font-bold">${shortfall.toFixed(2)}</span>{' '}
                    to proceed with this upgrade.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setView('deposit')}
                    className="w-full cursor-pointer bg-primary hover:bg-primary-light text-white py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Wallet className="w-4 h-4" />
                    Deposit Funds
                  </button>
                  <button
                    onClick={resetAndClose}
                    className="w-full cursor-pointer text-gray-500 hover:text-gray-700 py-2 text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {view === 'deposit' && (
              <div>
                <button
                  onClick={() => setView('warning')}
                  className="text-gray-400 cursor-pointer hover:text-gray-600 text-xs mb-4 flex items-center gap-1 transition-colors"
                >
                  ← Back
                </button>

                <Dialog.Title className="text-lg font-bold text-gray-900 mb-1">
                  Deposit Funds
                </Dialog.Title>
                <Dialog.Description className="text-sm text-gray-400 mb-5">
                  Choose an amount and network to initiate your deposit.
                </Dialog.Description>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Amount (USD)
                  </label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min={MIN_DEPOSIT}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Minimum deposit:{' '}
                    <span className="font-medium text-gray-600">
                      ${MIN_DEPOSIT}
                    </span>
                  </p>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Network
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {networks.map((n) => (
                      <button
                        key={n}
                        onClick={() => setNetwork(n)}
                        className={`py-2.5 cursor-pointer rounded-xl text-sm font-semibold border transition-colors ${
                          network === n
                            ? 'bg-primary text-white border-primary'
                            : 'bg-gray-50 text-gray-600 border-[#E8E8E8] hover:bg-gray-100'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
                    {error}
                  </p>
                )}

                <button
                  onClick={handleDeposit}
                  disabled={
                    isLoading || !amount || parseFloat(amount) < MIN_DEPOSIT
                  }
                  className="w-full bg-primary hover:bg-primary-light disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Initiating...
                    </>
                  ) : (
                    'Continue to Payment'
                  )}
                </button>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {paymentData && (
        <DepositPaymentModal
          open={paymentOpen}
          onOpenChange={setPaymentOpen}
          payment={paymentData}
        />
      )}
    </>
  )
}
