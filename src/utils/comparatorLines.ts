import { Line } from '../types/widget'
import { getStackTopBottomPositions } from './stackPositions'

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
