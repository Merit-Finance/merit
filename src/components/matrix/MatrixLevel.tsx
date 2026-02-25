import { MatrixNode, nodeKey } from '../../lib/MatrixType'
import { MatrixNodeCard } from './MtrixnodeCard'

interface MatrixLevelProps {
  nodes: MatrixNode[]
  level: number
  parentKey: string
}

function VerticalConnector() {
  return (
    <div className="flex justify-center">
      <div className="w-px h-6 bg-gray-200" />
    </div>
  )
}

function ChildrenGroup({ nodes, level, parentKey }: MatrixLevelProps) {
  if (!nodes.length) return null

  const connectorInset = `${100 / (2 * nodes.length)}%`

  return (
    <div className="flex flex-col items-center w-full">
      <VerticalConnector />
      <div className="relative flex items-start justify-center w-full">
        {nodes.length > 1 && (
          <div
            className="absolute top-7 h-px bg-gray-200"
            style={{ left: connectorInset, right: connectorInset }}
          />
        )}
        {nodes.map((node, i) => {
          const key = nodeKey(node, i, parentKey)
          return (
            <div
              key={key}
              className="flex flex-col items-center flex-1 min-w-0"
            >
              <MatrixNodeCard node={node} />
              {node.children && node.children.length > 0 && (
                <ChildrenGroup
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

export function MatrixLevel({ nodes, level, parentKey }: MatrixLevelProps) {
  return <ChildrenGroup nodes={nodes} level={level} parentKey={parentKey} />
}
