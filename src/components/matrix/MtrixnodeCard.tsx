import { MatrixNode } from '../../lib/MatrixType'

interface MatrixNodeCardProps {
  node: MatrixNode
  isRoot?: boolean
}

export function MatrixNodeCard({ node, isRoot = false }: MatrixNodeCardProps) {
  const isEmpty = !node.active || !node.id

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {node.hasPaid && !isRoot && (
          <span className="absolute -top-1 -right-1 z-10 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <svg
              className="w-2 h-2 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </span>
        )}
        <div
          className={`
            flex flex-col items-center justify-center rounded-xl border-2 transition-all
            ${
              isRoot
                ? 'w-16 h-16 bg-[#149AEE] border-[#149AEE] shadow-lg shadow-blue-200'
                : !isEmpty
                  ? 'w-14 h-14 bg-white border-green-400 shadow-md shadow-green-100'
                  : 'w-14 h-14 bg-gray-50 border-dashed border-gray-300'
            }
          `}
        >
          <svg
            className={`w-5 h-5 ${isRoot ? 'text-white' : !isEmpty ? 'text-green-500' : 'text-gray-300'}`}
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
      </div>
      <span
        className={`mt-1.5 text-xs font-medium truncate max-w-[72px] text-center ${
          isRoot
            ? 'text-[#149AEE]'
            : !isEmpty
              ? 'text-gray-700'
              : 'text-gray-400'
        }`}
      >
        {isRoot ? 'You' : node.name || 'Empty'}
      </span>
      {!isRoot && (
        <span className="text-[10px] text-gray-400">L{node.level - 1}</span>
      )}
    </div>
  )
}
