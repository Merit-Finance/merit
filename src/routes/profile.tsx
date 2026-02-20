import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  User,
  KeyRound,
  Wallet,
  CalendarDays,
  BadgeCheck,
  Eye,
  EyeOff,
  XCircle,
} from 'lucide-react'
import { useUserStore } from '@/stores/user.store'
import apiClient from '@/lib/api-client'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function EditableField({
  label,
  value,
  onSave,
}: {
  label: string
  value: string
  onSave?: (val: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value)

  return (
    <div>
      <label className="block text-sm text-gray-700 font-medium mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          className="flex-1 bg-gray-50 border border-[#E8E8E8] rounded-lg px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-gray-400 transition-colors disabled:cursor-default"
          value={val}
          disabled={!editing}
          onChange={(e) => setVal(e.target.value)}
        />
        {editing ? (
          <button
            className="px-4 py-2.5 bg-gray-900 text-white text-sm rounded-lg font-medium hover:bg-gray-700 transition-colors"
            onClick={() => {
              onSave?.(val)
              setEditing(false)
            }}
          >
            Save
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

function ReadOnlyField({ label, value }: { label: string; value: string }) {
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

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  show: boolean
  onToggle: () => void
}) {
  return (
    <div>
      <label className="block text-sm text-gray-700 font-medium mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-gray-50 border border-[#E8E8E8] rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-800 outline-none focus:border-gray-400 transition-colors"
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

function ProfilePage() {
  const { userData, fetchUser } = useUserStore()

  const [walletAddress, setWalletAddress] = useState('')
  const [walletSaved, setWalletSaved] = useState(false)

  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState<string | null>(null)
  const [pwSuccess, setPwSuccess] = useState(false)

  const handleSaveName = async (name: string) => {
    try {
      await apiClient.patch('/user/profile', { name })
      fetchUser()
    } catch (err) {
      console.error('Failed to update name', err)
    }
  }

  const handleChangePassword = async () => {
    setPwLoading(true)
    setPwError(null)
    setPwSuccess(false)
    try {
      await apiClient.patch('/user/change-password', {
        oldPassword,
        newPassword,
      })
      setPwSuccess(true)
      setOldPassword('')
      setNewPassword('')
      setTimeout(() => {
        setShowPasswordForm(false)
        setPwSuccess(false)
      }, 2000)
    } catch (err: any) {
      setPwError(err.response?.data?.message || 'Failed to change password.')
    } finally {
      setPwLoading(false)
    }
  }

  const resetPasswordForm = () => {
    setShowPasswordForm(false)
    setOldPassword('')
    setNewPassword('')
    setPwError(null)
    setPwSuccess(false)
  }

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your account information and settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] space-y-5">
            <h2 className="text-gray-900 font-semibold text-base">
              Account Information
            </h2>
            <EditableField
              label="Full Name"
              value={userData?.name ?? ''}
              onSave={handleSaveName}
            />
            {/* <ReadOnlyField label="Username" value={userData?.userName ?? '—'} /> */}
            <ReadOnlyField label="Email" value={userData?.email ?? '—'} />
            <ReadOnlyField
              label="Phone Number"
              value={userData?.phoneNumber ?? '—'}
            />
            <ReadOnlyField
              label="Referral Code"
              value={userData?.referralCode ?? '—'}
            />
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] space-y-3">
            <h2 className="text-gray-900 font-semibold text-base">Security</h2>

            {!showPasswordForm ? (
              <button
                onClick={() => setShowPasswordForm(true)}
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
                    onClick={resetPasswordForm}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>

                <PasswordField
                  label="Current Password"
                  value={oldPassword}
                  onChange={setOldPassword}
                  show={showOld}
                  onToggle={() => setShowOld((p) => !p)}
                />
                <PasswordField
                  label="New Password"
                  value={newPassword}
                  onChange={setNewPassword}
                  show={showNew}
                  onToggle={() => setShowNew((p) => !p)}
                />

                {pwError && (
                  <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {pwError}
                  </p>
                )}
                {pwSuccess && (
                  <p className="text-xs text-green-600 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                    Password changed successfully!
                  </p>
                )}

                <button
                  onClick={handleChangePassword}
                  disabled={pwLoading || !oldPassword || !newPassword}
                  className="w-full bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {pwLoading ? (
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

          <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] space-y-4">
            <h2 className="text-gray-900 font-semibold text-base">
              Payment Settings
            </h2>
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">
                Default USDT Wallet Address (BEP-20)
              </label>
              <input
                className="w-full bg-gray-50 border border-[#E8E8E8] rounded-lg px-4 py-2.5 text-sm text-gray-800 outline-none focus:border-gray-400 transition-colors"
                placeholder="0x..."
                value={walletAddress}
                onChange={(e) => {
                  setWalletAddress(e.target.value)
                  setWalletSaved(false)
                }}
              />
            </div>
            <button
              onClick={() => setWalletSaved(true)}
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            >
              <Wallet className="w-4 h-4" />
              {walletSaved ? 'Saved!' : 'Save Wallet Address'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8]">
            <h2 className="text-gray-900 font-semibold text-base mb-4">
              Account Status
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Account Status:</span>
                <span className="bg-green-50 text-green-600 text-xs font-semibold px-3 py-1 rounded-full border border-green-100">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Current Level:</span>
                <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
                  Level {userData?.currentLevel ?? '—'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">Member Since:</span>
                <span className="text-gray-900 text-sm font-semibold">
                  {userData?.createdAt
                    ? new Date(userData.createdAt).toLocaleDateString()
                    : '—'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8]">
            <h2 className="text-gray-900 font-semibold text-base mb-4">
              Quick Info
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-500">User ID:</span>
                <span className="text-sm text-gray-700 font-medium ml-auto truncate max-w-[120px]">
                  {userData?.id ?? '—'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <BadgeCheck
                  className={`w-4 h-4 shrink-0 ${userData?.isVerified ? 'text-green-500' : 'text-gray-300'}`}
                />
                <span className="text-sm text-gray-700 font-medium">
                  {userData?.isVerified
                    ? 'Verified Email'
                    : 'Email Not Verified'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-500">Joined:</span>
                <span className="text-sm text-gray-700 font-medium ml-auto">
                  {userData?.createdAt
                    ? new Date(userData.createdAt).toLocaleDateString()
                    : '—'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
