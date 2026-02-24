import * as Dialog from '@radix-ui/react-dialog'
import { MailCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RegistrationSuccessModalProps {
  open: boolean
  email: string
  onGoToSignIn: () => void
  onCheckEmail: () => void
}

export function RegistrationSuccessModal({
  open,
  email,
  onGoToSignIn,
  onCheckEmail,
}: RegistrationSuccessModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onCheckEmail()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-8 shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <MailCheck className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div className="text-center space-y-2 mb-6">
            <Dialog.Title className="text-xl font-bold text-gray-900">
              Account created!
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 leading-relaxed">
              We've sent a verification link to{' '}
              <span className="font-semibold text-gray-700">{email}</span>.
              Please check your inbox and verify your email to get started.
            </Dialog.Description>
          </div>

          <div className="space-y-2.5">
            <Button
              className="w-full cursor-pointer bg-primary hover:bg-primary-light text-white py-5 rounded-xl font-semibold"
              onClick={onGoToSignIn}
            >
              Go to Sign In
            </Button>
            <p className="text-xs text-center text-gray-400">
              Didn't receive it?{' '}
              <button
                type="button"
                className="text-primary cursor-pointer font-semibold hover:underline"
                onClick={onCheckEmail}
              >
                Check your email address
              </button>
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
