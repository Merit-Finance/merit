export interface Wallet {
  wallet: string
  network: 'BSC' | 'TON' | 'TRON'
}

export interface UserData {
  id: string
  name: string
  email: string
  phoneNumber: string
  userName: string
  currentLevel: number
  hasSetPin: boolean
  address: string
  role: string
  wallet: Wallet[]
  isVerified: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
  referralCode: string
  referredByUserId: string | null
  referredByName: string | null
}

export interface UserResponse {
  success: boolean
  message: string
  data: UserData
  statusCode: number
}

export interface LevelUpPayload {
  level: number
}

export interface LevelUpResponse {
  success: boolean
  message: string
  statusCode: number
}

export interface UpdateInfoPayload {
  userName?: string
  name?: string
  address?: string
}

export interface UpdateInfoResponse {
  success: boolean
  message: string
  statusCode: number
}

export interface UpdateWalletPayload {
  wallet: string
  network: 'BSC' | 'TON' | 'TRON'
  pin: string
}

export interface UpdateWalletResponse {
  success: boolean
  message: string
  statusCode: number
}
