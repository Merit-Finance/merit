import apiClient from '@/lib/api-client'
import { AuthResponse, OTPResponse, RegisterPayload } from '@/lib/auth'

export const authService = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/users', payload)
    return response.data
  },

  sendOTP: async (email: string): Promise<OTPResponse> => {
    const response = await apiClient.post<OTPResponse>('/auth/login', {
      email,
    })
    return response.data
  },

  resendOTP: async (email: string): Promise<OTPResponse> => {
    const response = await apiClient.post<OTPResponse>('/auth/resend-otp', {
      email,
    })
    return response.data
  },

  verifyOTP: async (email: string, otp: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      '/auth/login-with-otp',
      {
        email,
        otp,
      },
    )
    return response.data
  },

  loginWithPassword: async (
    email: string,
    password: string,
  ): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      '/auth/password-login',
      {
        email,
        password,
      },
    )
    return response.data
  },
}
