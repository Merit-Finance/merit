import { useState } from 'react'
import { KeyRound, XCircle } from 'lucide-react'
import { authService } from '@/services/auth.service'
import { PasswordField } from './PasswordField'

export function SecuritySection() {
  const [showForm, setShowForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChangePassword = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      await authService.changePassword({ currentPassword, newPassword })
      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setTimeout(() => {
        setShowForm(false)
        setSuccess(false)
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setShowForm(false)
    setCurrentPassword('')
    setNewPassword('')
    setError(null)
    setSuccess(false)
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] space-y-3">
      <h2 className="text-gray-900 font-semibold text-base">Security</h2>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center gap-3 px-4 py-3 border border-[#E8E8E8] rounded-xl hover:bg-gray-50 transition-colors text-left"
        >
          <KeyRound className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-700 font-medium">
            Change Password
          </span>
        </button>
      ) : (
        <div className="border border-[#E8E8E8] rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700 font-medium">
                Change Password
              </span>
            </div>
            <button
              onClick={handleReset}
              className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>

          <PasswordField
            label="Current Password"
            value={currentPassword}
            onChange={setCurrentPassword}
            show={showCurrent}
            onToggle={() => setShowCurrent((p) => !p)}
          />
          <PasswordField
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            show={showNew}
            onToggle={() => setShowNew((p) => !p)}
          />

          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {success && (
            <p className="text-xs text-green-600 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
              Password changed successfully!
            </p>
          )}

          <button
            onClick={handleChangePassword}
            disabled={loading || !currentPassword || !newPassword}
            className="w-full cursor-pointer bg-primary hover:bg-primary-light disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              'Update Password'
            )}
          </button>
        </div>
      )}
    </div>
  )
}
