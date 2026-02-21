import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface PasswordFieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  show: boolean
  onToggle: () => void
}

export function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
}: PasswordFieldProps) {
  return (
    <div>
      <label className="block text-sm text-gray-700 font-medium mb-1">
        {label}
      </label>
      <div className="relative">
        <Input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-10"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}
