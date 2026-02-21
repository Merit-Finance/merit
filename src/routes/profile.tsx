import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useUserStore } from '@/stores/user.store'
import { AccountInfoSection } from '@/components/profile/AccountInfoSection'
import { SecuritySection } from '@/components/profile/SecuritySection'
import { PaymentSettingsSection } from '@/components/profile/PaymentSettingSection'
import { AccountSidebar } from '@/components/profile/AccountSideBar'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { fetchUser } = useUserStore()

  useEffect(() => {
    fetchUser()
  }, [])

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
          <AccountInfoSection />
          <SecuritySection />
          <PaymentSettingsSection />
        </div>
        <AccountSidebar />
      </div>
    </div>
  )
}
