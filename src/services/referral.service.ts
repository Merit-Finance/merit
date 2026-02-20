import apiClient from '@/lib/api-client'
import { ReferralListResponse, ReferralStatResponse } from '@/lib/referral'

export const referralService = {
  getReferralList: async (): Promise<ReferralListResponse> => {
    const response = await apiClient.get<ReferralListResponse>(
      '/users/referral-list',
    )
    return response.data
  },

  getReferralStat: async (): Promise<ReferralStatResponse> => {
    const response = await apiClient.get<ReferralStatResponse>(
      '/users/referral-stat',
    )
    return response.data
  },
}
