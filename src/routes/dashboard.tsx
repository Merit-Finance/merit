import { Copy, Receive } from '@/assets'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useBalanceStore } from '@/stores/balance.store'
import { useUserStore } from '@/stores/user.store'
import { useEffect, useState } from 'react'
import { WithdrawDialog } from '@/components/WithdrawDialog'
import {
  ArrowDownCircle,
  DollarSign,
  History,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react'
import { transactionService } from '@/services/transaction.service'
import { Transaction, TransactionMeta } from '@/lib/transaction'
import { Transfer } from '@/assets/svgs'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

const TX_LIMIT = 10

function DashboardPage() {
  const { mainBalance, isLoading, error, fetchMainBalance } = useBalanceStore()
  const { userData, fetchUser } = useUserStore()
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [txMeta, setTxMeta] = useState<TransactionMeta | null>(null)
  const [txLoading, setTxLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchMainBalance()
    fetchUser()
  }, [])

  useEffect(() => {
    const fetchTransactions = async () => {
      setTxLoading(true)
      try {
        const response = await transactionService.getTransactions({
          page: currentPage,
          limit: TX_LIMIT,
        })
        console.log('Response', response)
        if (response.success) {
          setTransactions(response.data)
          setTxMeta(response.meta)
        }
      } catch (error) {
        console.error('Failed to fetch transactions')
      } finally {
        setTxLoading(false)
      }
    }
    fetchTransactions()
  }, [currentPage])

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(
      `https://app.meritfinance.org/signup?ref=${userData?.referralCode}`,
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

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

  const totalPages = txMeta?.totalPages ?? 1
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  return (
    <div className="max-w-4xl mx-auto w-full space-y-4 sm:space-y-6">
      <section className="bg-gradient-to-br from-[#149AEE] to-[#0B7FD4] rounded-2xl py-6 px-5 sm:py-8 sm:px-10 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 sm:gap-6">
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

          <div className="flex flex-row sm:flex-col gap-2 sm:gap-3 sm:w-auto">
            <button
              onClick={() => setWithdrawOpen(true)}
              className="flex-1 sm:flex-none sm:w-auto cursor-pointer bg-white/20 hover:bg-white/30 text-white px-4 sm:px-6 py-2.5 rounded-full border border-white font-medium transition-all flex items-center justify-center gap-2 text-sm backdrop-blur-sm"
            >
              Withdraw <Receive />
            </button>
            <button
              onClick={() => navigate({ to: '/Transfer' })}
              className="flex-1 sm:flex-none sm:w-auto cursor-pointer bg-white/20 hover:bg-white/30 text-white px-4 sm:px-6 py-2.5 rounded-full border border-white font-medium transition-all flex items-center justify-center gap-2 text-sm backdrop-blur-sm"
            >
              Transfer <Transfer />
            </button>
          </div>
        </div>
      </section>

      <section
        className="bg-[#DAEAFF] rounded-2xl relative overflow-hidden"
        style={{ minHeight: '160px' }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/images/vector1.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        <div className="relative z-10 px-5 py-6 sm:px-10 sm:py-8 max-w-[55%] sm:max-w-sm">
          <h2 className="text-[#149AEE] text-base sm:text-2xl font-bold leading-snug">
            Upgrade your level to earn more rewards
          </h2>
          <button
            onClick={() => navigate({ to: '/earnings' })}
            className="mt-3 sm:mt-4 bg-[#149AEE] cursor-pointer hover:bg-[#0B7FD4] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium transition-all text-xs sm:text-sm whitespace-nowrap"
          >
            Upgrade to new level
          </button>
        </div>

        <div className="absolute bottom-0 right-4 sm:right-14 z-10 pointer-events-none">
          <img
            src="/images/gift.png"
            alt="Gift box"
            className="w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain object-bottom"
          />
        </div>
      </section>

      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E8E8E8]">
        <h3 className="text-gray-900 font-semibold mb-3">Your Referral Link</h3>
        <div className="flex items-center gap-3 bg-gray-50 border border-[#E8E8E8] rounded-xl px-4 py-3">
          <p className="text-gray-500 text-sm truncate flex-1">
            https://app.meritfinance.org/signup?ref=
            {userData?.referralCode ?? '...'}
          </p>
          <button
            onClick={handleCopyReferral}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              copied
                ? 'bg-green-50 text-green-600 border border-green-200'
                : 'bg-[#EDF1FF] text-primary hover:bg-blue-100 border border-transparent'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy />
                Copy
              </>
            )}
          </button>
        </div>
      </section>

      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E8E8E8]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-gray-900 font-semibold flex items-center gap-2">
            <History className="w-4 h-4 text-gray-500" />
            Transaction History
          </h3>
          {txMeta && txMeta.total > 0 && (
            <span className="text-xs text-gray-400">{txMeta.total} total</span>
          )}
        </div>

        {txLoading ? (
          <div className="space-y-3">
            {Array.from({ length: TX_LIMIT }).map((_, i) => (
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
          <>
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
                        {new Date(tx.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
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

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#E8E8E8]">
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={!hasPrev || txLoading}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 border border-[#E8E8E8] rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={!hasNext || txLoading}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 border border-[#E8E8E8] rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
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
