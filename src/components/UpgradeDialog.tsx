import { useAuthStore } from '@/stores/auth.stores'
import { userService } from '@/services/users.service'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useState } from 'react'

interface UpgradeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  level: number
  cost: number
  onSuccess?: () => void
}

export function UpgradeDialog({
  open,
  onOpenChange,
  level,
  cost,
  onSuccess,
}: UpgradeDialogProps) {
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const platformFee = level === 1 ? 5 : cost * 0.1
  const total = cost + platformFee

  const bullets = [
    'Upgrade will be processed instantly',
    `$${total.toFixed(2)} will be deducted from your balance`,
    `$${cost.toFixed(2)} will be credited to your upline`,
    `$${platformFee.toFixed(2)} platform fee allocated to system`,
  ]

  const getUserInitials = () => {
    if (!user?.name) return 'U'
    const names = user.name.trim().split(' ').filter(Boolean)
    if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase()
    return names[0][0].toUpperCase()
  }

  const handleConfirm = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await userService.levelUp(level)
      if (response.success) {
        onOpenChange(false)
        onSuccess?.()
      } else {
        setError('Upgrade failed. Please try again.')
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Upgrade failed. Please try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!isLoading) {
      setError(null)
      onOpenChange(open)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-70 w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <Dialog.Close
            disabled={isLoading}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-30"
          >
            <X className="w-4 h-4" />
          </Dialog.Close>

          <Dialog.Title className="text-lg font-bold text-gray-900">
            Upgrade to Level {level}
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-400 mt-0.5 mb-5">
            Upgrade will be processed instantly from your balance
          </Dialog.Description>

          <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center mb-4">
            <p className="text-xs text-gray-400 mb-3">Upline Account</p>
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg mb-2">
              {getUserInitials()}
            </div>
            <p className="text-gray-900 font-semibold text-sm">
              {user?.userName}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Level Cost:</span>
              <span className="text-gray-900 font-medium">
                ${cost.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                Platform Fee {level === 1 ? '(fixed)' : '(10%)'}:
              </span>
              <span className="text-gray-900 font-medium">
                ${platformFee.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm border-t border-gray-200 pt-2">
              <span className="text-gray-900 font-bold">Total:</span>
              <span className="text-gray-900 font-bold">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-5 space-y-1.5">
            {bullets.map((b) => (
              <div key={b} className="flex items-start gap-2">
                <span className="text-green-500 text-xs mt-0.5">✓</span>
                <p className="text-green-700 text-xs">{b}</p>
              </div>
            ))}
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
              {error}
            </p>
          )}

          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-light disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              'Confirm Upgrade'
            )}
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
