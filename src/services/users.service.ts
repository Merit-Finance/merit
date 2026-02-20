import apiClient from '@/lib/api-client'

export interface UserData {
  id: string
  name: string
  email: string
  phoneNumber: string
  userName: string
  currentLevel: number
  role: string
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

export const userService = {
  getUser: async (): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>('/users/email')
    return response.data
  },
  levelUp: async (level: number): Promise<LevelUpResponse> => {
    const response = await apiClient.post<LevelUpResponse>('/users/level-up', {
      level,
    })
    return response.data
  },
}
