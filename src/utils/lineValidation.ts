import { Point, StackBounds } from '../types/widget'

export const isValidStartPoint = (
  point: Point,
  stackBounds: StackBounds | null,
  type: 'top' | 'bottom'
): boolean => {
  if (!stackBounds) return false
  const isInXBounds =
    point.x >= stackBounds.left && point.x <= stackBounds.right
  const isInYBounds =
    type === 'top'
      ? point.y >= stackBounds.top && point.y <= stackBounds.centerY
      : point.y > stackBounds.centerY && point.y <= stackBounds.bottom
  return isInXBounds && isInYBounds
}

export const isValidEndPoint = isValidStartPoint
