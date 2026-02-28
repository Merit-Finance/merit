import { MatrixSidebar } from '@/components/matrix/MatrixSidebar'
import { MatrixStatsBar } from '@/components/matrix/MatrixStats'
import { MatrixTree } from '@/components/matrix/MatrixTree'
import { countByLevel } from '@/lib/MatrixType'
import { useMatrixStore } from '@/stores/matrix.store'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/matrix')({
  component: MatrixPage,
})

function MatrixPage() {
  const {
    matrixData,
    myParent,
    isLoading: loading,
    error,
    fetchMatrix,
  } = useMatrixStore()

  useEffect(() => {
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
          uplineUsername={myParent?.name ?? null}
        />
        <MatrixSidebar levelCounts={levelCounts} />
      </div>

      <MatrixStatsBar />
    </div>
  )
}
