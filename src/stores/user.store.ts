import { create } from 'zustand'
import { userService, UserData } from '@/services/users.service'

interface UserState {
  userData: UserData | null
  isLoading: boolean
  error: string | null

  fetchUser: () => Promise<void>
  clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  userData: null,
  isLoading: false,
  error: null,

  fetchUser: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await userService.getUser()
      if (response.success) {
        set({ userData: response.data, isLoading: false })
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch user.',
        isLoading: false,
      })
    }
  },

  clearUser: () => set({ userData: null, error: null }),
}))