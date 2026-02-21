export interface BalanceData {
  id: string
  amount: string
  type: 'MAIN' | 'REFERRAL'
  updatedAt: string
}

export interface BalanceResponse {
  success: boolean
  message: string
  data: BalanceData
  statusCode: number
}

export interface BalanceStat {
  totalWithdraw: number
  totalEarn: number
}

export interface BalanceStatResponse {
  success: boolean
  message: string
  data: BalanceStat
  statusCode: number
}
