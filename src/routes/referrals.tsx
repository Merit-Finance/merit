import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Copy,
  Share2,
  TrendingUp,
  Users,
  CheckCircle2,
  Award,
} from 'lucide-react'
import { useReferralStore } from '@/stores/referral.store'
import { useUserStore } from '@/stores/user.store'

export const Route = createFileRoute('/referrals')({
  component: ReferralsPage,
})

function ReferralsPage() {
  const { referralList, referralStat, isLoading, fetchAll } = useReferralStore()
  const { userData, fetchUser } = useUserStore()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchAll()
    fetchUser()
  }, [fetchAll])

  const referralLink = `https://app.meritfinance.org/signup?ref=${userData?.referralCode ?? ''}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Merit Finance',
          text: 'Join using my referral link and we both earn!',
          url: referralLink,
        })
      } catch (err) {
        // User cancelled or error — fallback to copy
        copyToClipboard()
      }
    } else {
      // Browser doesn't support Web Share API — fallback to copy
      copyToClipboard()
    }
  }

  const statCards = [
    {
      id: 1,
      label: 'Total Referrals',
      value: referralStat?.totalReferrals ?? 0,
      sub: 'All time',
      icon: Users,
      iconColor: 'text-blue-500',
      valueColor: 'text-gray-900',
    },
    {
      id: 2,
      label: 'Active Referrals',
      value: referralStat?.activeReferrals ?? 0,
      sub: 'Activated accounts',
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      valueColor: 'text-green-500',
    },
    {
      id: 3,
      label: 'Referral Earnings',
      value: `$${parseFloat(referralStat?.referralEarnings ?? '0').toFixed(2)}`,
      sub: '$2 per referral',
      icon: TrendingUp,
      iconColor: 'text-purple-500',
      valueColor: 'text-purple-500',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Referrals</h1>
        <p className="text-gray-500 text-sm mt-1">
          Share your referral link and earn $2 per activated referral
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.id}
              className="bg-white rounded-2xl p-6 border border-[#E8E8E8]"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              {isLoading ? (
                <div className="h-10 w-24 bg-gray-100 rounded-lg animate-pulse mb-1" />
              ) : (
                <h2
                  className={`text-4xl font-semibold mb-1 ${stat.valueColor}`}
                >
                  {stat.value}
                </h2>
              )}
              <p className="text-gray-400 text-sm">{stat.sub}</p>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8]">
        <h2 className="text-gray-900 font-semibold text-base mb-4">
          Your Referral Link
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 bg-gray-50 border border-[#E8E8E8] rounded-lg px-4 py-3 text-sm text-gray-600 font-mono truncate">
            {referralLink}
          </div>
          <button
            onClick={copyToClipboard}
            className="p-3 border border-[#E8E8E8] rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Copy
              className={`w-4 h-4 ${copied ? 'text-green-500' : 'text-gray-500'}`}
            />
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
          <p className="text-sm text-blue-600 mt-1">
            Earn $2 for every user who joins and activates using your link.
            Bonus is added to your Referral Bonus Account.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8]">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-5 h-5 text-gray-700" />
          <h2 className="text-gray-900 font-semibold text-base">
            Tier Rewards Progress
          </h2>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-10 bg-gray-100 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {(referralStat?.tiers ?? []).map((tier) => (
              <div key={tier.level}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-900 font-medium text-sm">
                    Tier {tier.level}
                  </span>
                  <div className="text-right">
                    <span className="text-green-500 font-semibold text-sm">
                      ${tier.reward}
                    </span>
                    <p className="text-gray-400 text-xs">
                      {tier.required} referrals
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${tier.completed ? 'bg-green-500' : 'bg-gray-900'}`}
                    style={{ width: `${tier.progressPercent}%` }}
                  />
                </div>
                <p className="text-gray-400 text-xs mt-1">
                  {tier.current}/{tier.required} referrals
                  {tier.remaining > 0 && ` • ${tier.remaining} more needed`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8]">
        <h2 className="text-gray-900 font-semibold text-base mb-4">
          Your Referrals
        </h2>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : referralList.length === 0 ? (
          <div className="text-center py-10">
            <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              No referrals yet. Share your link to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {referralList.map((ref) => (
              <div
                key={ref.id}
                className="flex items-center justify-between p-4 border border-[#E8E8E8] rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center bg-green-50">
                    <Users className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium text-sm">
                      {ref.name ?? ref.username}
                    </p>
                    <p className="text-gray-400 text-xs">
                      Joined {new Date(ref.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-100">
                  Level {ref.level}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
