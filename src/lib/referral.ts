export interface ReferralUser {
  id: string
  name: string
  username: string
  tier?: string
  joinedAt: string
  status: 'active' | 'pending'
  level?: string
  earnings?: string
}

export interface ReferralTier {
  level: number
  required: number
  reward: number
  current: number
  completed: boolean
  progressPercent: number
  remaining: number
}

export interface ReferralStat {
  totalReferrals: number
  referralBalance: string
  activeReferrals: number
  referralEarnings: string
  tiers: ReferralTier[]
}

export interface ReferralListResponse {
  success: boolean
  message: string
  data: ReferralUser[]
  statusCode: number
}

export interface ReferralStatResponse {
  success: boolean
  message: string
  data: ReferralStat
  statusCode: number
}
