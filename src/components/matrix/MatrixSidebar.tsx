import { LEVEL_CONFIG } from '../../lib/MatrixType'

interface MatrixSidebarProps {
  levelCounts: Record<number, number>
}

export function MatrixSidebar({ levelCounts }: MatrixSidebarProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-[#E8E8E8] p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">
          How It Works
        </h2>
        <ul className="space-y-2">
          {[
            'Each position spawns 2 positions below it',
            'You need 2 direct referrals to start',
            'Additional referrals automatically spillover',
            'Matrix fills: top to bottom, left to right',
            'Complete all positions to finish each level',
          ].map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-xs text-gray-500"
            >
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#149AEE] shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E8E8] p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">
          Level Requirements
        </h2>
        <div className="space-y-2">
          {LEVEL_CONFIG.map(({ level, positions, color }) => (
            <div
              key={level}
              className="flex items-center justify-between py-2 border-b border-[#F5F5F5] last:border-0"
            >
              <span className="text-sm text-gray-600">Level {level}</span>
              <div className="text-right">
                <p className={`text-sm font-bold ${color}`}>
                  {positions} positions
                </p>
                <p className="text-xs text-gray-400">
                  filled: {levelCounts[level + 1] ?? 0}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
        <p className="text-xs text-blue-700 leading-relaxed">
          <span className="font-semibold">Spillover Benefit:</span> Your
          upline's referrals can automatically fill positions in your matrix!
        </p>
      </div>
    </div>
  )
}
