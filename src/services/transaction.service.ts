import apiClient from '@/lib/api-client'
import {
  GetTransactionsParams,
  TransactionListResponse,
  WithdrawPayload,
  WithdrawResponse,
} from '@/lib/transaction'

export const transactionService = {
  getTransactions: async (
    params: GetTransactionsParams = {},
  ): Promise<TransactionListResponse> => {
    const { page = 1, limit = 10 } = params
    const response = await apiClient.get<TransactionListResponse>(
      '/balance/transaction',
      { params: { page, limit } },
    )
    return response.data
  },

  withdraw: async (payload: WithdrawPayload): Promise<WithdrawResponse> => {
    const response = await apiClient.post<WithdrawResponse>(
      '/transaction/withdraw',
      payload,
    )
    return response.data
  },
}
