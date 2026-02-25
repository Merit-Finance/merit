import apiClient from '@/lib/api-client'
import {
  LevelUpResponse,
  UpdateInfoPayload,
  UpdateInfoResponse,
  UpdateWalletPayload,
  UpdateWalletResponse,
  UserResponse,
} from '../lib/user'

export interface SearchUserResponse {
  success: boolean
  data: {
    id: string
    name: string
    email: string
    userName: string
    wallet: { address: string }[]
  }
}

export const userService = {
  getUser: async (): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>('/users/email')
    return response.data
  },

  searchByIdentifier: async (
    identifier: string,
  ): Promise<SearchUserResponse> => {
    const response = await apiClient.get<SearchUserResponse>('/search-user', {
      params: { identifier },
    })
    return response.data
  },

  levelUp: async (level: number): Promise<LevelUpResponse> => {
    const response = await apiClient.post<LevelUpResponse>('/users/level-up', {
      level,
    })
    return response.data
  },

  updateInfo: async (
    payload: UpdateInfoPayload,
  ): Promise<UpdateInfoResponse> => {
    const response = await apiClient.put<UpdateInfoResponse>(
      '/users/update-info',
      payload,
    )
    return response.data
  },

  updateWallet: async (
    payload: UpdateWalletPayload,
  ): Promise<UpdateWalletResponse> => {
    const response = await apiClient.put<UpdateWalletResponse>(
      '/users/update-wallet',
      payload,
    )
    return response.data
  },
}
