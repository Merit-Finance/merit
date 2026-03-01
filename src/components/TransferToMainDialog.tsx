import * as Dialog from '@radix-ui/react-dialog'
import { X, ArrowDownCircle, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import apiClient from '@/lib/api-client'

interface TransferToMainDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function TransferToMainDialog({
  open,
  onOpenChange,
  onSuccess,
}: TransferToMainDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    setError(null)
    try {
      await apiClient.post('/balance/transfer')
      setSuccess(true)
      onSuccess?.()
      setTimeout(() => {
        setSuccess(false)
        onOpenChange(false)
      }, 2000)
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Transfer failed. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  const handleClose = (val: boolean) => {
    if (loading) return
    setError(null)
    setSuccess(false)
    onOpenChange(val)
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[92%] max-w-md bg-white rounded-2xl shadow-xl p-5 sm:p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <Dialog.Close
            disabled={loading}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </Dialog.Close>

          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-50 flex items-center justify-center">
              <ArrowDownCircle className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            </div>
          </div>

          <Dialog.Title className="text-base sm:text-lg font-bold text-gray-900 text-center">
            Transfer to Main Balance
          </Dialog.Title>
          <Dialog.Description className="text-xs sm:text-sm text-gray-400 text-center mt-1 mb-5">
            This will move your available earnings into your main balance.
          </Dialog.Description>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-3 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-600 text-xs sm:text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-3 mb-4">
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
              <p className="text-green-600 text-xs sm:text-sm font-medium">
                Transfer successful!
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => handleClose(false)}
              disabled={loading}
              className="flex-1 py-3 rounded-xl border border-[#E8E8E8] text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading || success}
              className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-light disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing…
                </>
              ) : (
                'Confirm Transfer'
              )}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
