import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { CheckCircle2, Lock, PlusCircle } from 'lucide-react'
import { UpgradeDialog } from '@/components/UpgradeDialog'
import { useBalanceStore } from '@/stores/balance.store'
import { useUserStore } from '@/stores/user.store'
import { InsufficientBalanceDialog } from '@/components/InsuffucientBalanceDialog'
import { useMatrixStore } from '@/stores/matrix.store'
import { MatrixNode } from '@/lib/MatrixType'

export const Route = createFileRoute('/earnings')({
  component: EarningsPage,
})

function getPlatformFee(level: number, cost: number): number {
  if (level === 1) return 5
  return cost * 0.1
}

const levelConfig = [
  { level: 1, maxPositions: 2, cost: 20, earnings: '$40.00' },
  { level: 2, maxPositions: 4, cost: 30, earnings: '$120.00' },
  { level: 3, maxPositions: 8, cost: 80, earnings: '$640.00' },
  { level: 4, maxPositions: 16, cost: 300, earnings: '$4800.00' },
]

function getDepthNodes(node: MatrixNode, depth: number): MatrixNode[] {
  if (node.depth === depth) return [node]
  return node.children.flatMap((c) => getDepthNodes(c, depth))
}

/**
 * Status is determined purely by whether the user has purchased the level,
 * not by how many referral slots are filled.
 * - 'complete'  → user has upgraded PAST this level (currentLevel > level)
 * - 'active'    → user is currently on this level OR it's the next available one
 * - 'locked'    → user hasn't reached the previous level yet
 */
function getLevelStatus(
  level: number,
  currentLevel: number,
): 'complete' | 'active' | 'locked' {
  if (currentLevel > level) return 'complete'
  if (currentLevel >= level - 1) return 'active'
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
  matrix,
  mainBalance,
  currentLevel,
  onUpgradeClick,
  onInsufficientBalance,
}: {
  level: number
  maxPositions: number
  cost: number
  earnings: string
  matrix: MatrixNode | null
  mainBalance: number | null
  currentLevel: number
  onUpgradeClick: (level: number) => void
  onInsufficientBalance: (required: number, available: number) => void
}) {
  const status = getLevelStatus(level, currentLevel)
  const isComplete = status === 'complete'
  const isLocked = status === 'locked'
  const isActive = status === 'active'

  const platformFee = getPlatformFee(level, cost)
  const totalCost = cost + platformFee

  const nodes = matrix ? getDepthNodes(matrix, level + 1) : []
  const paidCount = nodes.filter((n) => n.hasPaid).length
  const pct = (paidCount / maxPositions) * 100

  // User has purchased this level if currentLevel >= level
  const hasSubscribed = currentLevel >= level

  const handleUpgradeClick = () => {
    const balance = mainBalance ?? 0
    if (balance < totalCost) {
      onInsufficientBalance(totalCost, balance)
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
            {paidCount}/{maxPositions} paid
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${isLocked ? 'bg-gray-200' : 'bg-green-500'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Level Cost:</span>
          <span
            className={`font-semibold ${isLocked ? 'text-gray-300' : 'text-gray-900'}`}
          >
            ${cost.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Platform Fee:</span>
          <span
            className={`font-semibold ${isLocked ? 'text-gray-300' : 'text-orange-500'}`}
          >
            +${platformFee.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-1.5 mt-1">
          <span className="text-gray-700 font-semibold">Total:</span>
          <span
            className={`font-bold ${isLocked ? 'text-gray-300' : 'text-gray-900'}`}
          >
            ${totalCost.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm pt-0.5">
          <span className="text-gray-400">Earnings:</span>
          <span
            className={`font-semibold ${isLocked || earnings === '$0.00' ? 'text-gray-300' : 'text-green-500'}`}
          >
            {earnings}
          </span>
        </div>
      </div>

      {/* Not yet purchased → show Upgrade button */}
      {isActive && !hasSubscribed && (
        <button
          onClick={handleUpgradeClick}
          className="w-full flex cursor-pointer items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Upgrade — ${totalCost.toFixed(2)}
        </button>
      )}

      {/* Purchased, slots still filling → In Progress */}
      {isActive && hasSubscribed && paidCount < maxPositions && (
        <div className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-2.5 rounded-xl text-sm font-semibold border border-blue-100">
          In Progress ({paidCount}/{maxPositions})
        </div>
      )}

      {/* Purchased and all slots filled → Completed (even if not yet upgraded to next level) */}
      {((isActive && hasSubscribed && paidCount >= maxPositions) ||
        isComplete) && (
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
  const { matrixData, fetchMatrix } = useMatrixStore()

  const selectedLevel = levelConfig.find((l) => l.level === upgradeLevel)
  const currentLevel = userData?.currentLevel ?? 0

  useEffect(() => {
    fetchBalanceStat()
    fetchMainBalance()
    fetchUser()
    fetchMatrix()
  }, [])

  const handleInsufficientBalance = (required: number, available: number) => {
    setInsufficientData({ required, available })
    setInsufficientOpen(true)
  }

  const handleUpgradeSuccess = async () => {
    fetchUser()
    fetchMainBalance()
    fetchBalanceStat()
    fetchMatrix()
  }

  function formatAmount(value: number): string {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`
    return `$${value.toFixed(2)}`
  }

  const earningsStats = [
    {
      id: 1,
      label: 'Overall Balance',
      amount: formatAmount(balanceStat?.overallBalance ?? 0),
    },
    {
      id: 2,
      label: 'Total Earned',
      amount: formatAmount(balanceStat?.totalEarn ?? 0),
    },
    {
      id: 3,
      label: 'Referral Earnings',
      amount: formatAmount(balanceStat?.referralEarnings ?? 0),
    },
  ]

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
        <p className="text-gray-500 text-sm mt-1">Track your earnings</p>
      </div>

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
              <h2 className="text-gray-900 text-4xl font-semibold mb-4 truncate">
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

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 text-xs text-blue-700 leading-relaxed">
          <span className="font-semibold">Platform Fee:</span> Level 1 includes
          a fixed $5.00 fee. Levels 2–4 include a 10% platform fee on top of the
          level cost.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {levelConfig.map((lvl) => (
            <LevelCard
              key={lvl.level}
              {...lvl}
              matrix={matrixData}
              mainBalance={mainBalance}
              currentLevel={currentLevel}
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
