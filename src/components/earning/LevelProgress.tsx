import { LevelCard } from './LevelCard'

const levelConfig = [
  { level: 1, maxPositions: 2, cost: 20, earnings: '$40.00' },
  { level: 2, maxPositions: 4, cost: 30, earnings: '$60.00' },
  { level: 3, maxPositions: 8, cost: 50, earnings: '$0.00' },
  { level: 4, maxPositions: 16, cost: 100, earnings: '$0.00' },
]

interface LevelProgressProps {
  currentLevel: number
  mainBalance: number | null
  onUpgradeClick: (level: number) => void
  onInsufficientBalance: (required: number, available: number) => void
}

export function LevelProgress({
  currentLevel,
  mainBalance,
  onUpgradeClick,
  onInsufficientBalance,
}: LevelProgressProps) {
  return (
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
            onUpgradeClick={onUpgradeClick}
            onInsufficientBalance={onInsufficientBalance}
          />
        ))}
      </div>
    </div>
  )
}

export { levelConfig }
