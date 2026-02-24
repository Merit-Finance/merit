import { User, CalendarDays, BadgeCheck } from 'lucide-react'
import { useUserStore } from '@/stores/user.store'

export function AccountSidebar() {
  const { userData } = useUserStore()

  return (
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
              {userData?.isVerified ? 'Verified Email' : 'Email Not Verified'}
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
          {userData?.referredByName && (
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Referred By:</span>
              <span className="text-gray-700 text-xs font-semibold">
                {userData.referredByName}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
