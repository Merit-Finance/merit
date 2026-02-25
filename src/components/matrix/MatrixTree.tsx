import { MatrixLevel } from './MatrixLevel'
import { MatrixNode } from '../../lib/MatrixType'

interface MatrixTreeProps {
  matrixData: MatrixNode | null
  loading: boolean
  error: string | null
  uplineUsername?: string | null
}

function YouNode() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-2xl bg-[#149AEE] flex items-center justify-center shadow-lg shadow-blue-200">
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
      </div>
      <span className="mt-1.5 text-xs font-semibold text-[#149AEE]">You</span>
    </div>
  )
}

export function MatrixTree({
  matrixData,
  loading,
  error,
  uplineUsername,
}: MatrixTreeProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E8E8] p-4 sm:p-6">
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-900">
          Complete Matrix Tree
        </p>
        <p className="text-xs text-gray-400 mt-0.5">2×2 Matrix Structure</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-6 py-10">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-14 rounded-xl bg-gray-100 animate-pulse"
              style={{ width: `${Math.min(100, i * 20)}%` }}
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      ) : matrixData ? (
        <div className="w-full overflow-x-auto pb-4">
          <div
            className="flex flex-col items-center"
            style={{ minWidth: 'max-content' }}
          >
            {uplineUsername && (
              <>
                <div className="flex flex-col items-center mb-1">
                  <span className="text-[10px] text-gray-400 mb-1">
                    Your Upline
                  </span>
                  <div className="flex items-center gap-1.5 bg-gray-50 border border-[#E8E8E8] rounded-full px-3 py-1">
                    <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg
                        className="w-2.5 h-2.5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-gray-700">
                      @{uplineUsername}
                    </span>
                  </div>
                </div>
                <div className="w-px h-4 bg-gray-200" />
              </>
            )}

            <YouNode />

            <div className="w-px h-6 bg-gray-200" />

            {matrixData.children && matrixData.children.length > 0 && (
              <MatrixLevel
                nodes={matrixData.children}
                level={1}
                parentKey={matrixData.id ?? 'root'}
              />
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
