import apiClient from '@/lib/api-client'
import { MatrixResponse } from '@/lib/MatrixType'

export const matrixService = {
  getMatrix: async (): Promise<MatrixResponse> => {
    const response = await apiClient.get<MatrixResponse>('/users/matrix')
    return response.data
  },
}
