import { MatrixNode, nodeKey } from '../../lib/MatrixType'
import { MatrixNodeCard } from './MtrixnodeCard'

interface MatrixLevelProps {
  nodes: MatrixNode[]
  level: number
  parentKey: string
}

function Connector() {
  return (
    <div className="flex justify-center">
      <div className="w-px h-6 bg-gray-200" />
    </div>
  )
}

export function MatrixLevel({ nodes, level, parentKey }: MatrixLevelProps) {
  if (!nodes.length) return null

  return (
    <div className="flex flex-col items-center w-full">
      <Connector />
      <div
        className="relative flex items-start justify-center w-full"
        style={{ gap: `${Math.max(12, 40 - level * 6)}px` }}
      >
        {nodes.length > 1 && (
          <div
            className="absolute top-7 left-1/2 -translate-x-1/2 h-px bg-gray-200"
            style={{ width: 'calc(100% - 64px)' }}
          />
        )}
        {nodes.map((node, i) => {
          const key = nodeKey(node, i, parentKey)
          return (
            <div key={key} className="flex flex-col items-center">
              <MatrixNodeCard node={node} />
              {node.children && node.children.length > 0 && (
                <MatrixLevel
                  nodes={node.children}
                  level={level + 1}
                  parentKey={key}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
