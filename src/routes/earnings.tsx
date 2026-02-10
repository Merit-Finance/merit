import { Level1, Level2, USDT } from '@/assets'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/earnings')({
  component: EarningsPage,
})

const earningsStats = [
  {
    id: 1,
    label: 'Overall Balance',
    amount: '$54.12',
    button: null,
  },
  {
    id: 2,
    label: 'Total earned',
    amount: '$34.12',
    button: {
      text: 'Increase earning',
      variant: 'outlined',
    },
  },
  {
    id: 3,
    label: 'Referral Earnings',
    amount: '$14.12',
    button: {
      text: 'Refer friends to earn more',
      variant: 'outlined',
    },
  },
]

function EarningsPage() {
  return (
    <div className="max-w-7xl mx-auto w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {earningsStats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white rounded-2xl p-6 border border-[#E8E8E8]"
          >
            <p className="text-gray-500 text-sm mb-2">{stat.label}</p>
            <h2 className="text-gray-900 text-4xl font-semibold mb-4">
              {stat.amount}
            </h2>
            {stat.button && (
              <button className="text-[#149AEE] border border-[#149AEE] hover:bg-[#149AEE] hover:text-white px-4 py-2 rounded-full text-sm font-medium transition-all">
                {stat.button.text}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl mx-auto p-6 shadow-sm border border-gray-100 max-w-md">
        <div className="flex items-center gap-8 mb-6">
          <div>
            <p className="text-gray-500 text-sm mb-2">Current level</p>
            <div className="flex items-center gap-2">
              <span className="text-lg">
                <Level1 />
              </span>
              <span className="font-semibold text-gray-900">Level 1</span>
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-2">Upgrade to</p>
            <div className="flex items-center gap-2">
              <span className="text-lg">
                <Level2 />
              </span>
              <span className="font-semibold text-gray-900">Level 2</span>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col border border-[#EDEDED] p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 font-medium text-sm">You Pay</p>
            <p className="text-gray-400 text-sm">≈ 12.12 USDC</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <USDT />
              <div>
                <p className="font-semibold text-gray-900">USDT</p>
                <p className="font-normal text-gray-400">USDT</p>
              </div>
            </div>
            <p className="text-gray-900 text-2xl font-bold">10.12</p>
          </div>
        </div>

        <div className="bg-[#EDF1FF] rounded-lg p-4 mb-6">
          <p className="text-gray-600 text-sm mb-1">Projected earnings</p>
          <p className="text-[#0075BD] text-2xl font-bold mb-2">
            32.12{' '}
            <span className="text-[#00998F] font-medium text-lg">+215%</span>
          </p>
          <p className="text-[#2F2F2F] text-sm">
            Withdraw immediately cycle is complete
          </p>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Transaction Fee</span>
            <span className="text-gray-900 font-medium">
              0.113 ETH ($0.171)
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Protocol Fee</span>
            <span className="text-gray-900 font-medium">0.1%</span>
          </div>
          <div className="flex items-center justify-between text-sm border-t border-gray-200 pt-2">
            <span className="text-gray-500">Total amount</span>
            <span className="text-gray-900 font-bold">983.22</span>
          </div>
        </div>

        <button className="w-full bg-[#149AEE] cursor-pointer hover:bg-[#0B7FD4] text-white py-3 rounded-lg font-semibold transition-all">
          Upgrade to level 2
        </button>
      </div>
    </div>
  )
}
