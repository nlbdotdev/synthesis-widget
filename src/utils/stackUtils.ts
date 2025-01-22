import { Point, StackBounds, Line } from '../types/widget'

export const VERTICAL_PADDING = 20

export const getStackBounds = (
  element: HTMLDivElement | null
): StackBounds | null => {
  if (!element) return null
  const rect = element.getBoundingClientRect()
  return {
    left: rect.left,
    right: rect.right,
    top: rect.top,
    bottom: rect.bottom,
    centerY: rect.top + rect.height / 2,
  }
}

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

export const getStackTopBottomPositions = (
  stackElement: HTMLDivElement | null
): { top: Point; bottom: Point; centerX: number } | null => {
  if (!stackElement) return null

  const stackRect = stackElement.getBoundingClientRect()
  const stackCenterX =
    ((stackRect.left + stackRect.width / 2) / window.innerWidth) * 100

  // Find the first and last block elements
  const blocks = stackElement.querySelectorAll('[data-block]')
  if (!blocks.length) return null

  const firstBlock = blocks[0].getBoundingClientRect()
  const lastBlock = blocks[blocks.length - 1].getBoundingClientRect()

  return {
    top: {
      x: stackCenterX,
      y: ((firstBlock.top - VERTICAL_PADDING) / window.innerHeight) * 100,
    },
    bottom: {
      x: stackCenterX,
      y: ((lastBlock.bottom + VERTICAL_PADDING) / window.innerHeight) * 100,
    },
    centerX: stackCenterX,
  }
}

export const generateComparatorLines = (
  leftStack: HTMLDivElement | null,
  rightStack: HTMLDivElement | null
): Line[] => {
  const leftPositions = getStackTopBottomPositions(leftStack)
  const rightPositions = getStackTopBottomPositions(rightStack)

  if (!leftPositions || !rightPositions) return []

  return [
    {
      start: {
        x: leftPositions.centerX,
        y: leftPositions.top.y,
      },
      end: {
        x: rightPositions.centerX,
        y: rightPositions.top.y,
      },
      type: 'top',
    },
    {
      start: {
        x: leftPositions.centerX,
        y: leftPositions.bottom.y,
      },
      end: {
        x: rightPositions.centerX,
        y: rightPositions.bottom.y,
      },
      type: 'bottom',
    },
  ]
}
