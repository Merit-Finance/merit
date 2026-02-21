import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { userService } from '@/services/users.service'
import { useUserStore } from '@/stores/user.store'

type Network = 'BSC' | 'TON' | 'TRON'
const NETWORKS: Network[] = ['BSC', 'TON', 'TRON']

export function PaymentSettingsSection() {
  const { userData, fetchUser } = useUserStore()
  const wallets = userData?.wallet ?? []

  const [newWalletAddress, setNewWalletAddress] = useState('')
  const [newWalletNetwork, setNewWalletNetwork] = useState<Network>('BSC')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleAddWallet = async () => {
    if (!newWalletAddress.trim()) return
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      await userService.updateWallet({
        wallet: newWalletAddress.trim(),
        network: newWalletNetwork,
      })
      setSuccess(true)
      setNewWalletAddress('')
      setNewWalletNetwork('BSC')
      fetchUser()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save wallet.')
    } finally {
      setLoading(false)
    }
  }

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
              className="flex items-center justify-between gap-3 border border-[#E8E8E8] rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="shrink-0 bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-md">
                  {w.network}
                </span>
                <span className="text-sm text-gray-700 font-medium truncate">
                  {w.wallet}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-3">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
          Add Wallet
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
            Wallet saved successfully!
          </p>
        )}

        <button
          onClick={handleAddWallet}
          disabled={loading || !newWalletAddress.trim()}
          className="flex items-center cursor-pointer gap-2 bg-primary hover:bg-primary-light disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add Wallet
            </>
          )}
        </button>
      </div>
    </div>
  )
}
