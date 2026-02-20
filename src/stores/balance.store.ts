import { create } from 'zustand'
import { balanceService } from '@/services/balance.service'
import { BalanceStat } from '@/lib/auth'

interface BalanceState {
  mainBalance: number | null
  referralBalance: number | null
  balanceStat: BalanceStat | null
  isLoading: boolean
  error: string | null

  fetchMainBalance: () => Promise<void>
  fetchReferralBalance: () => Promise<void>
  fetchAllBalances: () => Promise<void>
  fetchBalanceStat: () => Promise<void>
  clearError: () => void
}

export const useBalanceStore = create<BalanceState>((set) => ({
  mainBalance: null,
  referralBalance: null,
  balanceStat: null,
  isLoading: false,
  error: null,

  fetchMainBalance: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await balanceService.getMainBalance()
      if (response.success && response.data) {
        set({ mainBalance: parseFloat(response.data.amount), isLoading: false })
      }
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          'Failed to fetch balance. Please try again.',
        isLoading: false,
      })
    }
  },

  fetchReferralBalance: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await balanceService.getReferralBalance()
      if (response.success && response.data) {
        set({
          referralBalance: parseFloat(response.data.amount),
          isLoading: false,
        })
      }
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          'Failed to fetch balance. Please try again.',
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
        mainBalance: mainResponse.success
          ? parseFloat(mainResponse.data.amount)
          : null,
        referralBalance: referralResponse.success
          ? parseFloat(referralResponse.data.amount)
          : null,
        isLoading: false,
        error: null,
      })
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          'Failed to fetch balances. Please try again.',
        isLoading: false,
      })
    }
  },

  fetchBalanceStat: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await balanceService.getBalanceStat()
      if (response.success && response.data) {
        set({ balanceStat: response.data, isLoading: false })
      }
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message || 'Failed to fetch balance stats.',
        isLoading: false,
      })
    }
  },

  clearError: () => set({ error: null }),
}))
