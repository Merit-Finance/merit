import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Copy,
  Share2,
  TrendingUp,
  Users,
  CheckCircle2,
  Award,
  ArrowDownToLine,
} from 'lucide-react'
import { useReferralStore } from '@/stores/referral.store'
import { useUserStore } from '@/stores/user.store'
import { TransferToMainDialog } from '@/components/TransferToMainDialog'

export const Route = createFileRoute('/referrals')({
  component: ReferralsPage,
})

function ReferralsPage() {
  const { referralList, referralStat, isLoading, fetchAll } = useReferralStore()
  const { userData, fetchUser } = useUserStore()
  const [copied, setCopied] = useState(false)
  const [transferToMainOpen, setTransferToMainOpen] = useState(false)

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
          title: 'Merit Finance — Build Your Network. Earn as You Grow.',
          text: 'Merit Finance is a structured referral and task reward platform built around level progression',
          url: referralLink,
        })
      } catch (err) {
        copyToClipboard()
      }
    } else {
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
      value: `$${parseFloat(referralStat?.referralBalance ?? '0').toFixed(2)}`,
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

      <div className="grid grid-cols-1 xs:grid-cols-3 md:grid-cols-3 gap-3 sm:gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.id}
              className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E8E8E8]"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <p className="text-gray-500 text-xs sm:text-sm">{stat.label}</p>
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.iconColor}`} />
              </div>
              {isLoading ? (
                <div className="h-8 sm:h-10 w-20 sm:w-24 bg-gray-100 rounded-lg animate-pulse mb-1" />
              ) : (
                <h2
                  className={`text-2xl sm:text-4xl font-semibold mb-1 ${stat.valueColor}`}
                >
                  {stat.value}
                </h2>
              )}
              <p className="text-gray-400 text-xs">{stat.sub}</p>
            </div>
          )
        })}
      </div>

      {/* Transfer earnings */}
      <section
        onClick={() => setTransferToMainOpen(true)}
        className="bg-white border border-[#E8E8E8] rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer hover:border-primary/40 hover:bg-blue-50/40 transition-all group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
            <ArrowDownToLine className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-gray-900 font-semibold text-sm">
              Transfer Earnings to Main
            </p>
            <p className="text-gray-400 text-xs mt-0.5">
              Move your referral earnings into your main balance
            </p>
          </div>
        </div>
        <div className="w-full sm:w-auto shrink-0 bg-primary group-hover:bg-primary-light text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors text-center whitespace-nowrap">
          Transfer Now
        </div>
      </section>

      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E8E8E8]">
        <h2 className="text-gray-900 font-semibold text-base mb-4">
          Your Referral Link
        </h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex-1 bg-gray-50 border border-[#E8E8E8] rounded-lg px-4 py-3 text-sm text-gray-600 font-mono truncate min-w-0">
              {referralLink}
            </div>
            <button
              onClick={copyToClipboard}
              className="p-3 border border-[#E8E8E8] rounded-lg hover:bg-gray-50 transition-colors shrink-0"
            >
              <Copy
                className={`w-4 h-4 ${copied ? 'text-green-500' : 'text-gray-500'}`}
              />
            </button>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors shrink-0"
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

      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E8E8E8]">
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

      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E8E8E8]">
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
                className="flex items-start justify-between p-3 sm:p-4 border border-[#E8E8E8] rounded-xl gap-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center bg-green-50 shrink-0">
                    <Users className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-900 font-medium text-sm truncate">
                      {ref.name ?? ref.username}
                    </p>
                    <p className="text-gray-400 text-xs">
                      Joined {new Date(ref.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-100">
                    Tier {ref.tier}
                  </span>
                  <span className="bg-purple-50 text-purple-600 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-100">
                    Level {ref.level ?? 0}
                  </span>
                  {parseInt(ref.level ?? '0', 10) >= 1 ? (
                    <span className="bg-green-50 text-green-600 text-xs font-medium px-2.5 py-1 rounded-full border border-green-100">
                      Active
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-400 text-xs font-medium px-2.5 py-1 rounded-full border border-gray-200">
                      Not Active
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TransferToMainDialog
        open={transferToMainOpen}
        onOpenChange={setTransferToMainOpen}
      />
    </div>
  )
}
