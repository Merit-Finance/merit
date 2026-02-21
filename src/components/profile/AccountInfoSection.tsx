import { userService } from '@/services/users.service'
import { useUserStore } from '@/stores/user.store'
import { EditableField } from './EditableField'
import { ReadOnlyField } from './ReadOnlyField'

export function AccountInfoSection() {
  const { userData, fetchUser } = useUserStore()

  const handleSaveName = async (name: string) => {
    try {
      await userService.updateInfo({ name })
      fetchUser()
    } catch (err) {
      console.error('Failed to update name', err)
    }
  }

  const handleSaveUserName = async (userName: string) => {
    try {
      await userService.updateInfo({ userName })
      fetchUser()
    } catch (err) {
      console.error('Failed to update username', err)
    }
  }

  const handleSaveAddress = async (address: string) => {
    try {
      await userService.updateInfo({ address })
      fetchUser()
    } catch (err) {
      console.error('Failed to update address', err)
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] space-y-5">
      <h2 className="text-gray-900 font-semibold text-base">
        Account Information
      </h2>
      <EditableField
        label="Full Name"
        value={userData?.name ?? ''}
        onSave={handleSaveName}
      />
      <EditableField
        label="User Name"
        value={userData?.userName ?? ''}
        onSave={handleSaveUserName}
      />
      <EditableField
        label="Address"
        value={userData?.address ?? ''}
        onSave={handleSaveAddress}
      />
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
  )
}
