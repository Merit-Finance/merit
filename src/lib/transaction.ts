export type TransactionDirection = 'CREDIT' | 'DEBIT'
export type Network = 'BSC' | 'TON' | 'TRON'
export type TransactionStatus =
  | 'PENDING'
  | 'COMPLETED'
  | 'SUCCESSFUL'
  | 'FAILED'
export type TransactionSource =
  | 'DIRECT_DEPOSIT'
  | 'LEVEL_UPGRADE'
  | 'REFERRAL_BONUS'
  | 'WITHDRAWAL'
  | 'UPGRADE'
  | 'TRANSFER'

export interface Transaction {
  id: string
  balanceId: string
  amount: string
  direction: TransactionDirection
  source: TransactionSource
  network: string | null
  level: number | null
  referenceId: string
  sender: string | null
  receiver: string | null
  createdAt: string
  status: TransactionStatus
}
export interface TransactionMeta {
  total: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface TransactionListApiResponse {
  success: boolean
  message: string
  statusCode: number
  data: {
    data: Transaction[]
  } & TransactionMeta
}

export interface TransactionListResponse {
  success: boolean
  data: Transaction[]
  meta: TransactionMeta
}

export interface WithdrawPayload {
  amount: number
  network: Network
  address: string
}

export interface WithdrawResponse {
  success: boolean
  message: string
  statusCode: number
}

export interface GetTransactionsParams {
  page?: number
  limit?: number
}
