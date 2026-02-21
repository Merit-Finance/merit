import { MatrixLevel } from './MatrixLevel'
import { MatrixNode } from '../../lib/MatrixType'
import { MatrixNodeCard } from './MtrixnodeCard'

interface MatrixTreeProps {
  matrixData: MatrixNode | null
  loading: boolean
  error: string | null
}

export function MatrixTree({ matrixData, loading, error }: MatrixTreeProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E8E8] p-6 overflow-x-auto">
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-900">
          Complete Matrix Tree
        </p>
        <p className="text-xs text-gray-400 mt-0.5">2×2 Matrix Structure</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-6 py-10">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-14 rounded-xl bg-gray-100 animate-pulse"
              style={{ width: `${100 - i * 20}%` }}
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      ) : matrixData ? (
        <div className="flex flex-col items-center min-w-[480px]">
          <MatrixNodeCard node={matrixData} isRoot />
          {matrixData.children && matrixData.children.length > 0 && (
            <MatrixLevel
              nodes={matrixData.children}
              level={1}
              parentKey={matrixData.id ?? 'root'}
            />
          )}
        </div>
      ) : null}
    </div>
  )
}
