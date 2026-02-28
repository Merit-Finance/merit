import { create } from 'zustand'
import { matrixService } from '@/services/Matrix.service'
import { MatrixNode, MatrixParent, padMatrix } from '@/lib/MatrixType'

interface MatrixState {
  matrixData: MatrixNode | null
  myParent: MatrixParent | null
  isLoading: boolean
  error: string | null
  fetchMatrix: () => Promise<void>
}

export const useMatrixStore = create<MatrixState>((set) => ({
  matrixData: null,
  myParent: null,
  isLoading: false,
  error: null,

  fetchMatrix: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await matrixService.getMatrix()
      if (response.success) {
        set({
          matrixData: padMatrix(response.data),
          myParent: response.data.myParent ?? null,
          isLoading: false,
        })
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to load matrix.',
        isLoading: false,
      })
    }
  },
}))
