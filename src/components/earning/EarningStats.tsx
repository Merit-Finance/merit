interface Stat {
  id: number
  label: string
  amount: string
}

interface EarningsStatsProps {
  stats: Stat[]
  isLoading: boolean
}

export function EarningsStats({ stats, isLoading }: EarningsStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
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
  )
}
