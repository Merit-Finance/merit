export type TransactionDirection = 'CREDIT' | 'DEBIT'
export type Network = 'BSC' | 'TON' | 'TRON'
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

export interface TransactionMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface WithdrawPayload {
  amount: string
  network: Network
  address: string
}

export interface WithdrawResponse {
  success: boolean
  message: string
  statusCode: number
}

export interface TransactionListResponse {
  success: boolean
  message: string
  data: Transaction[]
  meta: TransactionMeta
  statusCode: number
}

export interface GetTransactionsParams {
  page?: number
  limit?: number
}
