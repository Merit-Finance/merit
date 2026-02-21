import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'

interface EditableFieldProps {
  label: string
  value: string
  onSave?: (val: string) => Promise<void>
}

export function EditableField({ label, value, onSave }: EditableFieldProps) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!editing) setVal(value)
  }, [value, editing])

  return (
    <div>
      <label className="block text-sm text-gray-700 font-medium mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <Input
          value={val}
          disabled={!editing}
          onChange={(e) => setVal(e.target.value)}
        />
        {editing ? (
          <button
            disabled={loading}
            className="px-4 py-2.5 bg-primary hover:bg-primary-light disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm rounded-lg font-medium transition-colors"
            onClick={async () => {
              setLoading(true)
              await onSave?.(val)
              setLoading(false)
              setEditing(false)
            }}
          >
            {loading ? 'Saving…' : 'Save'}
          </button>
        ) : (
          <button
            className="px-4 py-2.5 border border-[#E8E8E8] text-gray-700 text-sm rounded-lg font-medium hover:bg-gray-50 transition-colors"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  )
}
