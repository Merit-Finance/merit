import apiClient from '@/lib/api-client'
import { BalanceResponse } from '@/lib/auth'

export const balanceService = {
  getMainBalance: async (): Promise<BalanceResponse> => {
    const response = await apiClient.get<BalanceResponse>('/balance?type=MAIN')
    return response.data
  },

  getReferralBalance: async (): Promise<BalanceResponse> => {
    const response = await apiClient.get<BalanceResponse>(
      '/balance?type=REFERRAL',
    )
    return response.data
  },

  getBalance: async (type: 'MAIN' | 'REFERRAL'): Promise<BalanceResponse> => {
    const response = await apiClient.get<BalanceResponse>(
      `/balance?type=${type}`,
    )
    return response.data
  },
}
