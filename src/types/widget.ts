import { Point } from 'motion/react'

export type { Point }
export type InteractionMode = 'none' | 'addRemove' | 'drawCompare'

export interface Line {
  start: Point
  end: Point
  type: 'top' | 'bottom'
}

export interface WidgetState {
  blockCount1: number
  blockCount2: number
  interactionMode: InteractionMode
  isInput: boolean
  showComparatorLines: boolean
  drawnLines: Line[]
  comparatorLines: Line[]
  isDrawing: boolean
  currentLine: Line | null
  autoSnapLines: boolean
  isAnimating: boolean
  animationOperator: string
  animationLines: { originalStart: Point; originalEnd: Point }[]
  hasCompletedAnimation: boolean
}

export interface StackBounds {
  left: number
  right: number
  top: number
  bottom: number
  centerY: number
}
