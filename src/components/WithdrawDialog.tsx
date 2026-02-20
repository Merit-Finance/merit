import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface WithdrawDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  availableBalance?: number
  minWithdrawal?: number
}

export function WithdrawDialog({
  open,
  onOpenChange,
  availableBalance = 125.5,
  minWithdrawal = 10,
}: WithdrawDialogProps) {
  const [amount, setAmount] = useState('')
  const [walletAddress, setWalletAddress] = useState('')

  const handleConfirm = () => {
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md bg-white rounded-2xl shadow-xl p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <Dialog.Close className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-4 h-4" />
          </Dialog.Close>

          <Dialog.Title className="text-lg md:text-start text-center  font-bold text-gray-900">
            Withdraw to USDT Wallet
          </Dialog.Title>
          <Dialog.Description className="text-sm md:text-start text-center text-gray-400 mt-0.5 mb-5">
            Enter the amount and BEP-20 wallet address for withdrawal
          </Dialog.Description>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              Amount (USD)
            </label>
            <Input
              type="number"
              min={minWithdrawal}
              max={availableBalance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
            <p className="text-gray-400 text-xs mt-1.5">
              Available: ${availableBalance.toFixed(2)} | Min: ${minWithdrawal}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 mb-1.5">
              USDT Wallet Address (BEP-20)
            </label>
            <Input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="0x..."
            />
          </div>

          <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5">
            <div className="flex items-start gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-red-600 text-sm font-semibold">
                Important Warning
              </p>
            </div>
            <p className="text-red-500 text-xs leading-relaxed">
              Only withdraw to a valid USDT BEP-20 0x address. Sending to the
              wrong network or incorrect address may result in{' '}
              <span className="font-bold">permanent loss of funds.</span>
            </p>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full bg-primary cursor-pointer hover:bg-primary-light text-white py-3 rounded-xl font-semibold text-sm transition-colors"
          >
            Confirm Withdrawal
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
