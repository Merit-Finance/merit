import PhoneInputPrimitive from 'react-phone-number-input'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  hasError?: boolean
  placeholder?: string
  defaultCountry?: string
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      value,
      onChange,
      disabled,
      hasError,
      placeholder = 'Phone number',
      defaultCountry = 'US',
    },
    ref,
  ) => {
    return (
      <div
        className={cn(
          // Exactly matches shadcn Input base styles
          'flex w-full rounded-md border bg-transparent px-3 py-[13px] text-sm shadow-xs transition-[color,box-shadow]',
          // Default border — same variable shadcn uses
          'border-input',
          // Blue focus ring — exactly matches shadcn Input focus-visible styles
          'focus-within:border-blue-500 focus-within:ring-[3px] focus-within:ring-blue-500/50',
          // Error state
          hasError && 'border-destructive ring-destructive/20',
          // Disabled
          disabled && 'cursor-not-allowed opacity-50 pointer-events-none',

          // ── Internal library element resets ──────────────────────────────

          // The wrapper flex row the library renders
          '[&_.PhoneInput]:flex [&_.PhoneInput]:w-full [&_.PhoneInput]:items-center [&_.PhoneInput]:gap-2',

          // Country selector button area
          '[&_.PhoneInputCountry]:flex [&_.PhoneInputCountry]:items-center [&_.PhoneInputCountry]:gap-1',
          '[&_.PhoneInputCountry]:border-r [&_.PhoneInputCountry]:border-input [&_.PhoneInputCountry]:pr-2.5 [&_.PhoneInputCountry]:mr-0.5',

          // The hidden <select> that sits over the flag (browser native dropdown)
          '[&_.PhoneInputCountrySelect]:absolute [&_.PhoneInputCountrySelect]:inset-0 [&_.PhoneInputCountrySelect]:opacity-0 [&_.PhoneInputCountrySelect]:cursor-pointer [&_.PhoneInputCountrySelect]:w-full',

          // Flag icon — kill the library's default black border/shadow
          '[&_.PhoneInputCountryIcon]:w-6 [&_.PhoneInputCountryIcon]:h-auto',
          '[&_.PhoneInputCountryIcon--border]:bg-transparent [&_.PhoneInputCountryIcon--border]:shadow-none',
          '[&_.PhoneInputCountryIconImg]:block [&_.PhoneInputCountryIconImg]:w-full [&_.PhoneInputCountryIconImg]:h-auto',

          // The actual text input — strip ALL library styles so our wrapper controls appearance
          '[&_.PhoneInputInput]:flex-1 [&_.PhoneInputInput]:min-w-0',
          '[&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:border-none [&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:ring-0 [&_.PhoneInputInput]:shadow-none',
          '[&_.PhoneInputInput]:text-sm [&_.PhoneInputInput]:text-foreground',
          '[&_.PhoneInputInput]:placeholder:text-muted-foreground',
          '[&_.PhoneInputInput]:disabled:cursor-not-allowed',
        )}
      >
        <PhoneInputPrimitive
          international
          defaultCountry={defaultCountry as any}
          value={value}
          onChange={(val) => onChange(val ?? '')}
          placeholder={placeholder}
          disabled={disabled}
          inputRef={ref}
        />
      </div>
    )
  },
)

PhoneInput.displayName = 'PhoneInput'

export { PhoneInput }
