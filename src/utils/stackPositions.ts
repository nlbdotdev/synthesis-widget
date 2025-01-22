import { Point, StackBounds } from '../types/widget'

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
