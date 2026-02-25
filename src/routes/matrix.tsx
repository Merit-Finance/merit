import { MatrixSidebar } from '@/components/matrix/MatrixSidebar'
import { MatrixStatsBar } from '@/components/matrix/MatrixStats'
import { MatrixTree } from '@/components/matrix/MatrixTree'
import { countByLevel, MatrixNode, padMatrix } from '@/lib/MatrixType'
import { matrixService } from '@/services/Matrix.service'
import { useUserStore } from '@/stores/user.store'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/matrix')({
  component: MatrixPage,
})

function MatrixPage() {
  const [matrixData, setMatrixData] = useState<MatrixNode | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { userData, fetchUser } = useUserStore()

  useEffect(() => {
    fetchUser()
    const fetchMatrix = async () => {
      setLoading(true)
      try {
        const response = await matrixService.getMatrix()
        if (response.success) setMatrixData(padMatrix(response.data))
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load matrix.')
      } finally {
        setLoading(false)
      }
    }
    fetchMatrix()
  }, [])

  const levelCounts = countByLevel(matrixData)

  return (
    <div className="max-w-7xl mx-auto w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Matrix Structure</h1>
        <p className="text-gray-500 text-sm mt-1">
          View your complete 2×2 matrix tree showing all levels and positions.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6 items-start">
        <MatrixTree
          matrixData={matrixData}
          loading={loading}
          error={error}
          uplineUsername={userData?.referredByName ?? null}
        />
        <MatrixSidebar levelCounts={levelCounts} />
      </div>

      <MatrixStatsBar />
    </div>
  )
}
