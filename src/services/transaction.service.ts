import apiClient from '@/lib/api-client'
import {
  GetTransactionsParams,
  TransactionListApiResponse,
  TransactionListResponse,
  WithdrawPayload,
  WithdrawResponse,
} from '@/lib/transaction'

export const transactionService = {
  getTransactions: async (
    params: GetTransactionsParams = {},
  ): Promise<TransactionListResponse> => {
    const { page = 1, limit = 10 } = params
    const response = await apiClient.get<TransactionListApiResponse>(
      '/balance/transaction',
      { params: { page, limit } },
    )
    const { data, ...meta } = response.data.data
    return {
      success: response.data.success,
      data,
      meta,
    }
  },

  withdraw: async (payload: WithdrawPayload): Promise<WithdrawResponse> => {
    const response = await apiClient.post<WithdrawResponse>(
      '/transaction/withdraw',
      payload,
    )
    return response.data
  },
}
