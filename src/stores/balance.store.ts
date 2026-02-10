import { create } from 'zustand'
import { balanceService } from '@/services/balance.service'

interface BalanceState {
  mainBalance: number | null
  referralBalance: number | null
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchMainBalance: () => Promise<void>
  fetchReferralBalance: () => Promise<void>
  fetchAllBalances: () => Promise<void>
  clearError: () => void
}

export const useBalanceStore = create<BalanceState>((set) => ({
  mainBalance: null,
  referralBalance: null,
  isLoading: false,
  error: null,

  fetchMainBalance: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await balanceService.getMainBalance()
      
      if (response.success && response.data) {
        const balance = parseFloat(response.data.amount)
        
        set({
          mainBalance: balance,
          isLoading: false,
          error: null,
        })
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 
        'Failed to fetch balance. Please try again.'
      
      set({
        error: errorMessage,
        isLoading: false,
      })
    }
  },

  fetchReferralBalance: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await balanceService.getReferralBalance()
      
      if (response.success && response.data) {
        const balance = parseFloat(response.data.amount)
        
        set({
          referralBalance: balance,
          isLoading: false,
          error: null,
        })
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 
        'Failed to fetch balance. Please try again.'
      
      set({
        error: errorMessage,
        isLoading: false,
      })
    }
  },

  fetchAllBalances: async () => {
    set({ isLoading: true, error: null })
    try {
      const [mainResponse, referralResponse] = await Promise.all([
        balanceService.getMainBalance(),
        balanceService.getReferralBalance(),
      ])
      
      set({
        mainBalance: mainResponse.success ? parseFloat(mainResponse.data.amount) : null,
        referralBalance: referralResponse.success ? parseFloat(referralResponse.data.amount) : null,
        isLoading: false,
        error: null,
      })
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 
        'Failed to fetch balances. Please try again.'
      
      set({
        error: errorMessage,
        isLoading: false,
      })
    }
  },

  clearError: () => set({ error: null }),
}))