import apiClient from '@/lib/api-client'
import { BalanceResponse, BalanceStatResponse } from '@/lib/auth'

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
  getBalanceStat: async (): Promise<BalanceStatResponse> => {
    const response = await apiClient.get<BalanceStatResponse>(
      '/balance/balance-stat',
    )
    return response.data
  },
}
