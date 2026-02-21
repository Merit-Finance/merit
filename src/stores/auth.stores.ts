import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '@/services/auth.service'
import { RegisterPayload, User } from '@/lib/auth'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  error: string | null

  register: (payload: RegisterPayload) => Promise<void>
  sendOTP: (email: string) => Promise<void>
  verifyOTP: (email: string, otp: string) => Promise<void>
  loginWithPassword: (email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
  setUser: (user: User | null) => void
}

const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('auth_token', accessToken)
  localStorage.setItem('refresh_token', refreshToken)
}

const clearTokens = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('auth-storage')
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,

      register: async (payload: RegisterPayload) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authService.register(payload)
          if (response.success && response.data) {
            setTokens(response.data.accessToken, response.data.refreshToken)
            set({
              user: response.data.user,
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
              isLoading: false,
              error: null,
            })
          }
        } catch (error: any) {
          set({
            error:
              error.response?.data?.message ||
              'Registration failed. Please try again.',
            isLoading: false,
          })
          throw error
        }
      },

      sendOTP: async (email: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authService.sendOTP(email)
          if (!response.success) {
            throw new Error(response.message || 'Failed to send OTP')
          }
          set({ isLoading: false, error: null })
        } catch (error: any) {
          set({
            error:
              error.response?.data?.message ||
              error.message ||
              'Failed to send OTP. Please try again.',
            isLoading: false,
          })
          throw error
        }
      },

      verifyOTP: async (email: string, otp: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authService.verifyOTP(email, otp)
          if (response.success && response.data) {
            setTokens(response.data.accessToken, response.data.refreshToken)
            set({
              user: response.data.user,
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
              isLoading: false,
              error: null,
            })
          } else {
            throw new Error(response.message || 'Invalid OTP')
          }
        } catch (error: any) {
          set({
            error:
              error.response?.data?.message ||
              error.message ||
              'Invalid OTP. Please try again.',
            isLoading: false,
          })
          throw error
        }
      },

      loginWithPassword: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authService.loginWithPassword(email, password)
          if (response.success && response.data) {
            setTokens(response.data.accessToken, response.data.refreshToken)
            set({
              user: response.data.user,
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
              isLoading: false,
              error: null,
            })
          } else {
            throw new Error(response.message || 'Login failed')
          }
        } catch (error: any) {
          set({
            error:
              error.response?.data?.message ||
              error.message ||
              'Login failed. Please try again.',
            isLoading: false,
          })
          throw error
        }
      },

      logout: () => {
        clearTokens()
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isLoading: false,
          error: null,
        })
      },

      clearError: () => set({ error: null }),

      setUser: (user: User | null) => set({ user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
)
