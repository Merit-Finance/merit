interface ReadOnlyFieldProps {
  label: string
  value: string
}

export function ReadOnlyField({ label, value }: ReadOnlyFieldProps) {
  return (
    <div>
      <label className="block text-sm text-gray-700 font-medium mb-1">
        {label}
      </label>
      <div className="bg-gray-50 border border-[#E8E8E8] rounded-lg px-4 py-2.5 text-sm text-gray-500">
        {value}
      </div>
    </div>
  )
}
