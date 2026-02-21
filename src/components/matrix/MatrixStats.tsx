import { LEVEL_CONFIG } from '../../lib/MatrixType'

export function MatrixStatsBar() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {LEVEL_CONFIG.map(({ level, positions, color, bg, border }) => (
        <div
          key={level}
          className={`${bg} border ${border} rounded-2xl p-4 text-center`}
        >
          <p className={`text-2xl font-bold ${color}`}>{positions}</p>
          <p className="text-xs text-gray-500 mt-1">Level {level}</p>
        </div>
      ))}
    </div>
  )
}
