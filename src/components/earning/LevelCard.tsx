import { CheckCircle2, Lock, PlusCircle } from 'lucide-react'

function getLevelStatus(level: number, currentLevel: number) {
  const effectiveLevel = currentLevel === 0 ? 1 : currentLevel
  if (level < effectiveLevel) return 'complete'
  if (level === effectiveLevel) return 'active'
  return 'locked'
}

interface LevelCardProps {
  level: number
  maxPositions: number
  cost: number
  earnings: string
  currentLevel: number
  mainBalance: number | null
  onUpgradeClick: (level: number) => void
  onInsufficientBalance: (required: number, available: number) => void
}

export function LevelCard({
  level,
  maxPositions,
  cost,
  earnings,
  currentLevel,
  mainBalance,
  onUpgradeClick,
  onInsufficientBalance,
}: LevelCardProps) {
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
          Complete Level {level - 1} First
        </button>
      )}
    </div>
  )
}
