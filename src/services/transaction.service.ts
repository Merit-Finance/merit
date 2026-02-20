import apiClient from '@/lib/api-client'

export type TransactionDirection = 'CREDIT' | 'DEBIT'
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED'
export type TransactionSource =
  | 'DIRECT_DEPOSIT'
  | 'LEVEL_UPGRADE'
  | 'REFERRAL_BONUS'
  | 'WITHDRAWAL'

export interface Transaction {
  id: string
  balanceId: string
  amount: string
  direction: TransactionDirection
  source: TransactionSource
  network: string
  referenceId: string
  createdAt: string
  status: TransactionStatus
}

export interface TransactionListResponse {
  success: boolean
  message: string
  data: Transaction[]
  statusCode: number
}

export const transactionService = {
  getTransactions: async (): Promise<TransactionListResponse> => {
    const response = await apiClient.get<TransactionListResponse>(
      '/balance/transaction',
    )
    return response.data
  },
}
