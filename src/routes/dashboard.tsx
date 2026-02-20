import { Copy, Receive } from '@/assets'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useBalanceStore } from '@/stores/balance.store'
import { useUserStore } from '@/stores/user.store'
import { useEffect, useState } from 'react'
import { WithdrawDialog } from '@/components/WithdrawDialog'
import { ArrowDownCircle, DollarSign, History } from 'lucide-react'
import { Transaction, transactionService } from '@/services/transaction.service'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { mainBalance, isLoading, error, fetchMainBalance } = useBalanceStore()
  const { userData, fetchUser } = useUserStore()
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [txLoading, setTxLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchMainBalance()
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchTransactions = async () => {
      setTxLoading(true)
      try {
        const response = await transactionService.getTransactions()
        if (response.success) setTransactions(response.data)
      } catch (error) {
        console.error('Failed to fetch transactions')
      } finally {
        setTxLoading(false)
      }
    }
    fetchTransactions()
  }, [])

  const formatBalance = (balance: number | null) => {
    if (balance === null) return '0.00'
    return balance.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const formatSource = (source: string) => {
    return source
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase())
  }

  return (
    <div className="max-w-4xl mx-auto w-full space-y-4 sm:space-y-6">
      <section className="bg-gradient-to-br from-[#149AEE] to-[#0B7FD4] rounded-2xl py-6 px-5 sm:py-8 sm:px-10 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div>
            <p className="text-white/90 text-sm mb-2">Current Balance</p>
            {isLoading ? (
              <div className="h-10 w-36 bg-white/20 rounded-lg animate-pulse" />
            ) : error ? (
              <>
                <h1 className="text-white text-4xl sm:text-6xl font-semibold">
                  --
                </h1>
                <p className="text-white/70 text-xs mt-1">{error}</p>
              </>
            ) : (
              <h1 className="text-white text-4xl sm:text-6xl font-semibold">
                ${formatBalance(mainBalance)}
              </h1>
            )}
          </div>

          <div className="flex flex-col sm:flex-col gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => setWithdrawOpen(true)}
              className="w-full sm:w-auto cursor-pointer bg-white/20 hover:bg-white/30 text-white px-4 sm:px-6 py-2.5 rounded-full border border-white font-medium transition-all flex items-center justify-center gap-2 text-sm backdrop-blur-sm"
            >
              Withdraw <Receive />
            </button>
          </div>
        </div>
      </section>

      <section
        className="bg-[#DAEAFF] rounded-2xl py-6 px-5 sm:py-8 sm:px-10 relative overflow-hidden"
        style={{
          backgroundImage: "url('/images/vector1.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '160px',
        }}
      >
        <div className="relative z-10 max-w-[55%] sm:max-w-sm">
          <h2 className="text-[#149AEE] text-lg sm:text-2xl font-bold leading-snug">
            Upgrade your level to
          </h2>
          <p className="text-[#149AEE] text-lg sm:text-2xl font-bold mb-3 sm:mb-4 leading-snug">
            earn more rewards
          </p>
          <button
            onClick={() => navigate({ to: '/earnings' })}
            className="bg-[#149AEE] cursor-pointer hover:bg-[#0B7FD4] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium transition-all text-xs sm:text-sm whitespace-nowrap"
          >
            Upgrade to new level
          </button>
        </div>

        <div className="absolute right-2 sm:right-16 bottom-0 z-10 pointer-events-none">
          <img
            src="/images/gift.png"
            alt="Gift box"
            className="w-24 h-24 sm:w-44 sm:h-44 object-contain object-bottom"
          />
        </div>
      </section>

      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E8E8E8]">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-gray-900 font-semibold mb-1">
              Your Referral Link
            </h3>
            <p className="text-gray-500 text-sm truncate">
              https://meritfinance.com/register/
              {userData?.referralCode ?? '...'}
            </p>
          </div>
          <button
            onClick={() =>
              navigator.clipboard.writeText(
                `https://meritfinance.com/register/${userData?.referralCode}`,
              )
            }
            className="bg-[#EDF1FF] cursor-pointer p-3 rounded-full transition-all shrink-0"
          >
            <Copy />
          </button>
        </div>
      </section>

      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E8E8E8]">
        <h3 className="text-gray-900 font-semibold mb-5 flex items-center gap-2">
          <History className="w-4 h-4 text-gray-500" />
          Transaction History
        </h3>

        {txLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-10">
            <History className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No transactions yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 sm:p-4 border border-[#E8E8E8] rounded-xl gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      tx.direction === 'CREDIT' ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    {tx.direction === 'CREDIT' ? (
                      <DollarSign className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDownCircle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-900 font-medium text-sm truncate">
                      {formatSource(tx.source)}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {new Date(tx.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={`text-sm font-semibold ${
                      tx.direction === 'CREDIT'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {tx.direction === 'CREDIT' ? '+' : '-'}$
                    {parseFloat(tx.amount).toFixed(2)}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-50 text-blue-500">
                      {tx.network}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        tx.status === 'COMPLETED'
                          ? 'bg-gray-900 text-white'
                          : tx.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {tx.status.toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <WithdrawDialog
        open={withdrawOpen}
        onOpenChange={setWithdrawOpen}
        availableBalance={mainBalance ?? 0}
      />
    </div>
  )
}
