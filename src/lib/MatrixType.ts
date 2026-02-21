export interface MatrixNode {
  id: string | null
  name: string | null
  level: number
  completed: boolean
  active: boolean
  isEmpty: boolean
  children: MatrixNode[]
}

export interface MatrixResponse {
  success: boolean
  message: string
  data: MatrixNode
  statusCode: number
}

export const LEVEL_CONFIG = [
  {
    level: 1,
    positions: 2,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    level: 2,
    positions: 4,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-100',
  },
  {
    level: 3,
    positions: 8,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
  },
  {
    level: 4,
    positions: 16,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
  },
]

export function nodeKey(
  node: MatrixNode,
  index: number,
  parentKey: string,
): string {
  return node.id ?? `${parentKey}-empty-${index}`
}

export function countByLevel(node: MatrixNode | null): Record<number, number> {
  if (!node) return {}
  const counts: Record<number, number> = {}
  const traverse = (n: MatrixNode) => {
    if (n.active && n.id) counts[n.level] = (counts[n.level] || 0) + 1
    n.children?.forEach(traverse)
  }
  node.children?.forEach(traverse)
  return counts
}
