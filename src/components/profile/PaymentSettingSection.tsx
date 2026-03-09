import { useState } from 'react'
import { Plus, Pencil, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { userService } from '@/services/users.service'
import { useUserStore } from '@/stores/user.store'
import { PinModal } from '@/components/PinModal'

type Network = 'BSC' | 'TON'
const NETWORKS: Network[] = ['BSC', 'TON']

export function PaymentSettingsSection() {
  const { userData, fetchUser } = useUserStore()
  const wallets = userData?.wallet ?? []

  const [newWalletAddress, setNewWalletAddress] = useState('')
  const [newWalletNetwork, setNewWalletNetwork] = useState<Network>('BSC')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [pinOpen, setPinOpen] = useState(false)
  const [pinError, setPinError] = useState<string | null>(null)

  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const handleEditClick = (index: number) => {
    const w = wallets[index]
    setEditingIndex(index)
    setNewWalletAddress(w.wallet)
    setNewWalletNetwork(w.network as Network)
    setError(null)
    setSuccess(false)
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setNewWalletAddress('')
    setNewWalletNetwork('BSC')
    setError(null)
  }

  const handleSubmitClick = () => {
    if (!newWalletAddress.trim()) return
    setPinError(null)
    setError(null)
    setPinOpen(true)
  }

  const handlePinConfirm = async (pin: string) => {
    setLoading(true)
    setPinError(null)
    try {
      await userService.updateWallet({
        wallet: newWalletAddress.trim(),
        network: newWalletNetwork,
        pin,
      })
      setPinOpen(false)
      setSuccess(true)
      setNewWalletAddress('')
      setNewWalletNetwork('BSC')
      setEditingIndex(null)
      fetchUser()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setPinError(
        err.response?.data?.message || 'Failed to save wallet. Check your PIN.',
      )
    } finally {
      setLoading(false)
    }
  }

  const isEditing = editingIndex !== null

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8] space-y-4">
      <h2 className="text-gray-900 font-semibold text-base">
        Payment Settings
      </h2>

      {wallets.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            Saved Wallets
          </p>
          {wallets.map((w, i) => (
            <div
              key={i}
              className={`flex items-center justify-between gap-3 border rounded-xl px-4 py-3 transition-colors ${
                editingIndex === i
                  ? 'border-primary bg-blue-50'
                  : 'border-[#E8E8E8]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="shrink-0 bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-md">
                  {w.network}
                </span>
                <span className="text-sm text-gray-700 font-medium truncate">
                  {w.wallet}
                </span>
              </div>
              <button
                onClick={() =>
                  editingIndex === i ? handleCancelEdit() : handleEditClick(i)
                }
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  editingIndex === i
                    ? 'text-gray-500 bg-white border border-[#E8E8E8] hover:bg-gray-50'
                    : 'text-primary bg-blue-50 hover:bg-blue-100'
                }`}
              >
                {editingIndex === i ? (
                  <>
                    <X className="w-3.5 h-3.5" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
          {isEditing ? 'Edit Wallet' : 'Add Wallet'}
        </p>

        <div className="flex gap-2">
          <select
            value={newWalletNetwork}
            onChange={(e) => setNewWalletNetwork(e.target.value as Network)}
            className="shrink-0 border border-[#E8E8E8] rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {NETWORKS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <Input
            placeholder="Wallet address"
            value={newWalletAddress}
            onChange={(e) => {
              setNewWalletAddress(e.target.value)
              setError(null)
              setSuccess(false)
            }}
          />
        </div>

        {error && (
          <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        {success && (
          <p className="text-xs text-green-600 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
            Wallet {isEditing ? 'updated' : 'saved'} successfully!
          </p>
        )}

        <button
          onClick={handleSubmitClick}
          disabled={!newWalletAddress.trim()}
          className="flex items-center cursor-pointer gap-2 bg-primary hover:bg-primary-light disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          {isEditing ? (
            <>
              <Pencil className="w-4 h-4" />
              Update Wallet
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add Wallet
            </>
          )}
        </button>
      </div>

      <PinModal
        open={pinOpen}
        onOpenChange={setPinOpen}
        onConfirm={handlePinConfirm}
        isLoading={loading}
        error={pinError}
        recipientName={`${newWalletNetwork} wallet`}
        amount={0}
        title={isEditing ? 'Confirm Edit' : 'Confirm Wallet'}
        description={`Enter your PIN to ${isEditing ? 'update' : 'save'} this ${newWalletNetwork} wallet address`}
      />
    </div>
  )
}
