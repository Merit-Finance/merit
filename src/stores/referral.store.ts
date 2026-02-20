import { create } from 'zustand'
import { referralService } from '@/services/referral.service'
import { ReferralStat, ReferralUser } from '@/lib/referral'

interface ReferralState {
  referralList: ReferralUser[]
  referralStat: ReferralStat | null
  isLoading: boolean
  isLoadingList: boolean
  isLoadingStat: boolean
  error: string | null

  fetchReferralList: () => Promise<void>
  fetchReferralStat: () => Promise<void>
  fetchAll: () => Promise<void>
  clearError: () => void
}

export const useReferralStore = create<ReferralState>((set) => ({
  referralList: [],
  referralStat: null,
  isLoading: false,
  isLoadingList: false,
  isLoadingStat: false,
  error: null,

  fetchReferralList: async () => {
    set({ isLoadingList: true, error: null })
    try {
      const response = await referralService.getReferralList()
      if (response.success && response.data) {
        set({ referralList: response.data, isLoadingList: false })
      }
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message || 'Failed to fetch referral list.',
        isLoadingList: false,
      })
    }
  },

  fetchReferralStat: async () => {
    set({ isLoadingStat: true, error: null })
    try {
      const response = await referralService.getReferralStat()
      if (response.success && response.data) {
        set({ referralStat: response.data, isLoadingStat: false })
      }
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message || 'Failed to fetch referral stats.',
        isLoadingStat: false,
      })
    }
  },

  // Run independently so a 404 on list doesn't kill stats
  fetchAll: async () => {
    set({ isLoading: true, error: null })

    try {
      const statResponse = await referralService.getReferralStat()
      console.log('statResponse:', statResponse)
      if (statResponse.success) {
        set({ referralStat: statResponse.data })
      }
    } catch (error: any) {
      console.error('stat fetch error:', error.message)
    }

    try {
      const listResponse = await referralService.getReferralList()
      if (listResponse.success) {
        set({ referralList: listResponse.data })
      }
    } catch (error: any) {
      console.error('list fetch error:', error.message)
    }

    set({ isLoading: false })
  },

  clearError: () => set({ error: null }),
}))
