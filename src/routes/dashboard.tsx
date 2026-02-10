import { Clock, Copy, Dollar, Receive, Send } from '@/assets'
import { createFileRoute } from '@tanstack/react-router'
import { useBalanceStore } from '@/stores/balance.store'
import { useEffect } from 'react'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

const activityData = [
  {
    id: 1,
    action: 'Upgraded',
    date: 'From 0x23...2ndw',
    amount: '+6.64 USDC',
    fee: '-$11',
  },
  {
    id: 2,
    action: 'Upgraded',
    date: 'From 0x23...2ndw',
    amount: '+6.64 USDC',
    fee: '-$11',
  },
  {
    id: 3,
    action: 'Upgraded',
    date: 'From 0x23...2ndw',
    amount: '+6.64 USDC',
    fee: '-$11',
  },
  {
    id: 4,
    action: 'Upgraded',
    date: 'From 0x23...2ndw',
    amount: '+6.64 USDC',
    fee: '-$11',
  },
  {
    id: 5,
    action: 'Upgraded',
    date: 'From 0x23...2ndw',
    amount: '+6.64 USDC',
    fee: '-$11',
  },
  {
    id: 6,
    action: 'Upgraded',
    date: 'From 0x23...2ndw',
    amount: '+6.64 USDC',
    fee: '-$11',
  },
]

function DashboardPage() {
  const { mainBalance, isLoading, error, fetchMainBalance } = useBalanceStore()
  console.log('main balance', mainBalance)
  const referralLink = 'merit.com/shebhi1234432'

  useEffect(() => {
    fetchMainBalance()
  }, [fetchMainBalance])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
  }

  const formatBalance = (balance: number | null) => {
    if (balance === null) return '0.00'
    return balance.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      <section className="bg-gradient-to-br from-[#149AEE] to-[#0B7FD4] rounded-2xl py-8 px-13 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/90 text-sm mb-2">Current Balance</p>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-12 w-32 bg-white/20 rounded animate-pulse"></div>
              </div>
            ) : error ? (
              <div>
                <h1 className="text-white text-6xl font-semibold">--</h1>
                <p className="text-white/70 text-xs mt-1">{error}</p>
              </div>
            ) : (
              <h1 className="text-white text-6xl font-semibold">
                ${formatBalance(mainBalance)}
              </h1>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <button className="bg-transparent hover:bg-white/30 text-white px-6 py-2.5 rounded-full cursor-pointer border border-white font-medium transition-all flex items-center gap-2 backdrop-blur-sm">
              Withdraw
              <Receive />
            </button>
            <button className="bg-white hover:bg-white/95 text-[#149AEE] px-6 py-2.5 rounded-full cursor-pointer font-medium transition-all flex items-center gap-2">
              Upgrade
              <Send />
            </button>
          </div>
        </div>
      </section>

      <section
        className="bg-[#DAEAFF] rounded-2xl py-8 px-10 relative overflow-hidden min-h-[200px]"
        style={{
          backgroundImage: "url('/images/vector1.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="relative z-10">
          <div className="max-w-md">
            <h2 className="text-[#149AEE] text-2xl font-bold mb-2">
              Upgrade your level to
            </h2>
            <p className="text-[#149AEE] text-2xl font-bold mb-4">
              earn more rewards
            </p>
            <button className="bg-[#149AEE] hover:bg-[#0B7FD4] text-white px-6 py-2.5 rounded-full font-medium transition-all">
              Upgrade to new level
            </button>
          </div>
        </div>

        <div className="absolute right-27 bottom-0 z-10">
          <img
            src="/images/gift.png"
            alt="Gift box"
            className="w-50 h-50 object-contain object-bottom"
          />
        </div>
      </section>

      <section className="bg-white rounded-2xl p-6 border border-[#E8E8E8]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-900 font-semibold mb-1">
              Your Referral Link
            </h3>
            <p className="text-gray-500 text-sm">{referralLink}</p>
          </div>
          <button
            onClick={copyToClipboard}
            className="bg-[#EDF1FF] cursor-pointer text-white p-3 rounded-full transition-all"
          >
            <Copy />
          </button>
        </div>
      </section>

      <section className="p-6">
        <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
          <Clock />
          Activity log
        </h3>

        <div className="space-y-4">
          {activityData.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-4">
                <Dollar />
                <div>
                  <p className="text-gray-900 font-medium">{activity.action}</p>
                  <p className="text-gray-500 text-sm">{activity.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[#149AEE] font-semibold">
                  {activity.amount}
                </p>
                <p className="text-gray-500 text-sm">{activity.fee}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
