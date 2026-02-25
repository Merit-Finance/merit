import * as Dialog from '@radix-ui/react-dialog'
import { X, ShieldCheck } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'

interface PinModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (pin: string) => void
  isLoading: boolean
  error: string | null
  recipientName: string
  amount: number
  // Optional overrides for non-transfer use cases (e.g. saving a wallet)
  title?: string
  description?: string
}

export function PinModal({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  error,
  recipientName,
  amount,
  title,
  description,
}: PinModalProps) {
  const [pin, setPin] = useState(['', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (open) {
      setPin(['', '', '', ''])
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    }
  }, [open])

  // Clear PIN digits on error so user can retry immediately
  useEffect(() => {
    if (error) {
      setPin(['', '', '', ''])
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    }
  }, [error])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newPin = [...pin]
    newPin[index] = value.slice(-1)
    setPin(newPin)
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
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
    const newPin = ['', '', '', '']
    pasted.split('').forEach((char, i) => {
      newPin[i] = char
    })
    setPin(newPin)
    const nextEmpty = newPin.findIndex((v) => !v)
    inputRefs.current[nextEmpty === -1 ? 3 : nextEmpty]?.focus()
  }

  const handleConfirm = () => {
    const fullPin = pin.join('')
    if (fullPin.length === 4) onConfirm(fullPin)
  }

  const handleOpenChange = (o: boolean) => {
    if (!o && (isLoading || error)) return
    if (!isLoading) onOpenChange(o)
  }

  const isComplete = pin.every((d) => d !== '')

  const modalTitle = title ?? 'Enter your PIN'
  const modalDescription =
    description ??
    (amount > 0
      ? `Confirm transfer of $${amount.toFixed(2)} to ${recipientName}`
      : `Confirm action for ${recipientName}`)

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => {
            if (isLoading || error) e.preventDefault()
          }}
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          <Dialog.Close
            disabled={isLoading}
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-30"
          >
            <X className="w-4 h-4" />
          </Dialog.Close>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <Dialog.Title className="text-lg font-bold text-gray-900 mb-1">
              {modalTitle}
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-400 mb-1">
              {modalDescription}
            </Dialog.Description>
          </div>

          <div className="flex items-center justify-center gap-3 my-6">
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
                disabled={isLoading}
                className={[
                  'w-13 h-14 text-center text-2xl font-bold',
                  digit ? 'border-primary bg-blue-50' : '',
                  error ? 'border-red-400 bg-red-50' : '',
                ].join(' ')}
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <button
            onClick={handleConfirm}
            disabled={!isComplete || isLoading}
            className="w-full bg-primary hover:bg-primary-light disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              'Confirm'
            )}
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
