export type UserRole = 'INVESTOR' | 'ADMIN' | 'USER'

export interface RegisterPayload {
  name: string
  email: string
  phoneNumber: string
  address: string
  password: string
  role: UserRole
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  phoneNumber?: string
  address?: string
  createdAt?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: User
    accessToken: string
    refreshToken: string
  }
  statusCode: number
}

export interface OTPResponse {
  success: boolean
  message: string
  statusCode: number
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

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
