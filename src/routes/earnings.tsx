import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { CheckCircle2, Lock, PlusCircle } from 'lucide-react'
import { UpgradeDialog } from '@/components/UpgradeDialog'
import { useBalanceStore } from '@/stores/balance.store'
import { useUserStore } from '@/stores/user.store'
import { InsufficientBalanceDialog } from '@/components/InsuffucientBalanceDialog'

export const Route = createFileRoute('/earnings')({
  component: EarningsPage,
})

const levelConfig = [
  { level: 1, maxPositions: 2, cost: 20, earnings: '$40.00' },
  { level: 2, maxPositions: 4, cost: 30, earnings: '$60.00' },
  { level: 3, maxPositions: 8, cost: 50, earnings: '$0.00' },
  { level: 4, maxPositions: 16, cost: 100, earnings: '$0.00' },
]

function getLevelStatus(level: number, currentLevel: number) {
  const effectiveLevel = currentLevel === 0 ? 1 : currentLevel
  if (level < effectiveLevel) return 'complete'
  if (level === effectiveLevel) return 'active'
  return 'locked'
}
function getLockedBy(level: number) {
  return `Complete Level ${level - 1} First`
}

function LevelCard({
  level,
  maxPositions,
  cost,
  earnings,
  currentLevel,
  mainBalance,
  onUpgradeClick,
  onInsufficientBalance,
}: {
  level: number
  maxPositions: number
  cost: number
  earnings: string
  currentLevel: number
  mainBalance: number | null
  onUpgradeClick: (level: number) => void
  onInsufficientBalance: (required: number, available: number) => void
}) {
  const status = getLevelStatus(level, currentLevel)
  const isComplete = status === 'complete'
  const isLocked = status === 'locked'
  const isActive = status === 'active'

  const positions = isComplete ? maxPositions : 0
  const pct = (positions / maxPositions) * 100

  const handleUpgradeClick = () => {
    const balance = mainBalance ?? 0
    if (balance < cost) {
      onInsufficientBalance(cost, balance)
      return
    }
    onUpgradeClick(level)
  }

  return (
    <div
      className={`bg-white rounded-2xl p-5 border border-[#E8E8E8] flex flex-col gap-4 ${isLocked ? 'opacity-75' : ''}`}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 text-base">Level {level}</h3>
        {isComplete && <CheckCircle2 className="w-5 h-5 text-green-500" />}
        {isLocked && <Lock className="w-4 h-4 text-gray-400" />}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-gray-400 text-sm">Progress</span>
          <span className="text-gray-900 text-sm font-semibold">
            {positions}/{maxPositions} positions
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              isComplete
                ? 'bg-green-500'
                : isLocked
                  ? 'bg-gray-200'
                  : 'bg-gray-900'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Cost:</span>
          <span
            className={`font-semibold ${isLocked ? 'text-gray-300' : 'text-gray-900'}`}
          >
            ${cost}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Earnings:</span>
          <span
            className={`font-semibold ${isLocked || earnings === '$0.00' ? 'text-gray-300' : 'text-green-500'}`}
          >
            {earnings}
          </span>
        </div>
      </div>

      {isActive && (
        <button
          onClick={handleUpgradeClick}
          className="w-full flex cursor-pointer items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Upgrade Level {level}
        </button>
      )}
      {isComplete && (
        <div className="w-full flex items-center justify-center gap-2 bg-green-50 text-green-600 py-2.5 rounded-xl text-sm font-semibold border border-green-100">
          <CheckCircle2 className="w-4 h-4" />
          Completed
        </div>
      )}
      {isLocked && (
        <button
          disabled
          className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-400 py-2.5 rounded-xl text-sm font-semibold cursor-not-allowed"
        >
          <Lock className="w-4 h-4" />
          {getLockedBy(level)}
        </button>
      )}
    </div>
  )
}

function EarningsPage() {
  const [upgradeLevel, setUpgradeLevel] = useState<number | null>(null)
  const [insufficientOpen, setInsufficientOpen] = useState(false)
  const [insufficientData, setInsufficientData] = useState({
    required: 0,
    available: 0,
  })

  const {
    balanceStat,
    mainBalance,
    isLoading,
    fetchBalanceStat,
    fetchMainBalance,
  } = useBalanceStore()
  const { userData, fetchUser } = useUserStore()

  const selectedLevel = levelConfig.find((l) => l.level === upgradeLevel)
  const currentLevel = userData?.currentLevel || 1

  useEffect(() => {
    fetchBalanceStat()
    fetchMainBalance()
    fetchUser()
  }, [])

  const handleInsufficientBalance = (required: number, available: number) => {
    setInsufficientData({ required, available })
    setInsufficientOpen(true)
  }

  const handleUpgradeSuccess = async () => {
    fetchUser()
    fetchMainBalance()
    fetchBalanceStat()
  }

  const earningsStats = [
    {
      id: 1,
      label: 'Overall Balance',
      amount: `$${(balanceStat?.totalEarn ?? 0).toFixed(2)}`,
    },
    {
      id: 2,
      label: 'Total Earned',
      amount: `$${(balanceStat?.totalEarn ?? 0).toFixed(2)}`,
    },
    {
      id: 3,
      label: 'Referral Earnings',
      amount: `$${(balanceStat?.totalWithdraw ?? 0).toFixed(2)}`,
    },
  ]

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {earningsStats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white rounded-2xl p-6 border border-[#E8E8E8]"
          >
            <p className="text-gray-500 text-sm mb-2">{stat.label}</p>
            {isLoading ? (
              <div className="h-10 w-28 bg-gray-100 rounded-lg animate-pulse mb-4" />
            ) : (
              <h2 className="text-gray-900 text-4xl font-semibold mb-4">
                {stat.amount}
              </h2>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#E8E8E8]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-gray-900 font-semibold text-base">
            Level Progress
          </h2>
          <span className="text-xs text-gray-400 bg-gray-50 border border-[#E8E8E8] px-3 py-1 rounded-full">
            Current: Level {currentLevel}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {levelConfig.map((lvl) => (
            <LevelCard
              key={lvl.level}
              {...lvl}
              currentLevel={currentLevel}
              mainBalance={mainBalance}
              onUpgradeClick={setUpgradeLevel}
              onInsufficientBalance={handleInsufficientBalance}
            />
          ))}
        </div>
      </div>

      {selectedLevel && (
        <UpgradeDialog
          open={upgradeLevel !== null}
          onOpenChange={(open) => !open && setUpgradeLevel(null)}
          level={selectedLevel.level}
          cost={selectedLevel.cost}
          onSuccess={handleUpgradeSuccess}
        />
      )}

      <InsufficientBalanceDialog
        open={insufficientOpen}
        onOpenChange={setInsufficientOpen}
        required={insufficientData.required}
        available={insufficientData.available}
      />
    </div>
  )
}
