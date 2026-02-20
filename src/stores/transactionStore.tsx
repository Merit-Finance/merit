import { create } from 'zustand'
import { transactionService, Transaction } from '@/services/transaction.service'

interface TransactionState {
  transactions: Transaction[]
  isLoading: boolean
  error: string | null

  fetchTransactions: () => Promise<void>
  clearError: () => void
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  isLoading: false,
  error: null,

  fetchTransactions: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await transactionService.getTransactions()
      console.log('transactions response:', response)
      if (response.success && response.data) {
        set({ transactions: response.data, isLoading: false })
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch transactions.',
        isLoading: false,
      })
    }
  },

  clearError: () => set({ error: null }),
}))
