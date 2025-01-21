import { useState, useRef } from 'react'
import Stack from './Stack'
import ControlPanel from './ControlPanel'
import ComparatorLines from './ComparatorLines'
import { Point } from 'motion/react'

export type InteractionMode = 'none' | 'addRemove' | 'drawCompare'

interface Line {
  start: Point
  end: Point
  type: 'top' | 'bottom'
}

export interface WidgetState {
  blockCount1: number
  blockCount2: number
  interactionMode: InteractionMode
  isInput: boolean
  showComparator: boolean
  showComparatorLines: boolean
  drawnLines: Line[]
  comparatorLines: Line[]
  isDrawing: boolean
  currentLine: Line | null
  autoSnapLines: boolean
}

interface ComparatorProps {
  value1: number
  value2: number
  show: boolean
}

const Comparator = ({ value1, value2, show }: ComparatorProps) => {
  return (
    <div
      data-comparator
      className="text-6xl font-bold px-12 mx-16 py-6 bg-gray-100 rounded-xl shadow-md transition-shadow select-none"
    >
      {show ? (value1 > value2 ? '>' : value1 < value2 ? '<' : '=') : '?'}
    </div>
  )
}

interface StackBounds {
  left: number
  right: number
  top: number
  bottom: number
  centerY: number
}

const getStackBounds = (element: HTMLDivElement | null): StackBounds | null => {
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

const isValidStartPoint = (
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

const isValidEndPoint = (
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

const VERTICAL_PADDING = 20 // Adjust this value to increase/decrease padding (in pixels)

const getStackTopBottomPositions = (
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

const Widget = () => {
  const leftStackRef = useRef<HTMLDivElement>(null)
  const rightStackRef = useRef<HTMLDivElement>(null)

  const [state, setState] = useState<WidgetState>({
    blockCount1: 4,
    blockCount2: 2,
    interactionMode: 'none',
    isInput: false,
    showComparator: false,
    showComparatorLines: false,
    drawnLines: [],
    comparatorLines: [],
    isDrawing: false,
    currentLine: null,
    autoSnapLines: true,
  })

  // Add a ref to track if we should ignore the next mouse up
  const ignoreNextMouseUp = useRef(false)

  const playComparatorAnimation = () => {
    //    TODO
  }

  const handleLineDrawStart = (point: Point, isTouchEvent: boolean) => {
    if (state.interactionMode !== 'drawCompare') return

    const leftBounds = getStackBounds(leftStackRef.current)
    if (!leftBounds) return

    // Convert point to absolute coordinates
    const absolutePoint = {
      x: (point.x * window.innerWidth) / 100,
      y: (point.y * window.innerHeight) / 100,
    }

    // For touch events, we don't want to handle multiple starts
    if (isTouchEvent && state.isDrawing) {
      return
    }

    // Check if point is in left stack
    const isTopHalf = absolutePoint.y < leftBounds.centerY
    const lineType = isTopHalf ? 'top' : 'bottom'

    if (isValidStartPoint(absolutePoint, leftBounds, lineType)) {
      const hasLineOfType = state.drawnLines.some(
        (line) => line.type === lineType
      )
      if (!hasLineOfType) {
        const startPoint = {
          x: (absolutePoint.x / window.innerWidth) * 100,
          y: (absolutePoint.y / window.innerHeight) * 100,
        }

        setState({
          ...state,
          isDrawing: true,
          currentLine: {
            start: startPoint,
            end: startPoint,
            type: lineType,
          },
        })

        if (!isTouchEvent) {
          ignoreNextMouseUp.current = true
        }
      }
    }
  }

  const handleLineDrawMove = (point: Point) => {
    if (!state.isDrawing || !state.currentLine) return

    setState({
      ...state,
      currentLine: {
        ...state.currentLine,
        end: point,
      },
    })
  }

  const handleLineDrawEnd = (point: Point, isTouchEvent: boolean = false) => {
    if (!isTouchEvent && ignoreNextMouseUp.current) {
      ignoreNextMouseUp.current = false
      return
    }

    if (!state.currentLine) {
      return
    }

    const rightBounds = getStackBounds(rightStackRef.current)
    if (!rightBounds) return

    // Convert point to absolute coordinates
    const absolutePoint = {
      x: (point.x * window.innerWidth) / 100,
      y: (point.y * window.innerHeight) / 100,
    }

    // For touch events, if the start and end points are the same, clear the line
    if (
      isTouchEvent &&
      Math.abs(state.currentLine.start.x - state.currentLine.end.x) < 1 &&
      Math.abs(state.currentLine.start.y - state.currentLine.end.y) < 1
    ) {
      setState({
        ...state,
        isDrawing: false,
        currentLine: null,
      })
      return
    }

    if (isValidEndPoint(absolutePoint, rightBounds, state.currentLine.type)) {
      // Get the snap positions for both stacks
      const leftSnapPositions = getStackTopBottomPositions(leftStackRef.current)
      const rightSnapPositions = getStackTopBottomPositions(
        rightStackRef.current
      )

      let startPoint = state.currentLine.start
      let endPoint = {
        x: (absolutePoint.x / window.innerWidth) * 100,
        y: (absolutePoint.y / window.innerHeight) * 100,
      }

      if (state.autoSnapLines) {
        // Snap to center X and appropriate Y positions
        startPoint = leftSnapPositions
          ? {
              x: leftSnapPositions.centerX,
              y:
                state.currentLine.type === 'top'
                  ? leftSnapPositions.top.y
                  : leftSnapPositions.bottom.y,
            }
          : startPoint

        endPoint = rightSnapPositions
          ? {
              x: rightSnapPositions.centerX,
              y:
                state.currentLine.type === 'top'
                  ? rightSnapPositions.top.y
                  : rightSnapPositions.bottom.y,
            }
          : endPoint
      }

      setState({
        ...state,
        isDrawing: false,
        drawnLines: [
          ...state.drawnLines.filter(
            (line) => line.type !== state.currentLine!.type
          ),
          {
            ...state.currentLine,
            start: startPoint,
            end: endPoint,
          },
        ],
        currentLine: null,
      })
    } else {
      setState({
        ...state,
        isDrawing: false,
        currentLine: null,
      })
    }
  }

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="flex flex-row items-center justify-between w-full px-32">
        <div ref={leftStackRef}>
          <Stack
            count={state.blockCount1}
            setCount={(count) => setState({ ...state, blockCount1: count })}
            isInput={state.isInput}
            interactionMode={state.interactionMode}
          />
        </div>

        <Comparator
          value1={state.blockCount1}
          value2={state.blockCount2}
          show={state.showComparator}
        />

        <div ref={rightStackRef}>
          <Stack
            count={state.blockCount2}
            setCount={(count) => setState({ ...state, blockCount2: count })}
            isInput={state.isInput}
            interactionMode={state.interactionMode}
          />
        </div>
        <ComparatorLines
          drawnLines={state.drawnLines}
          comparatorLines={state.comparatorLines}
          currentLine={state.currentLine}
          isDrawing={state.isDrawing}
          showComparatorLines={state.showComparatorLines}
          interactionMode={state.interactionMode}
          onLineDrawStart={handleLineDrawStart}
          onLineDrawEnd={handleLineDrawEnd}
          onLineDrawMove={handleLineDrawMove}
          rightStackRef={rightStackRef.current}
        />
      </div>
      <ControlPanel
        state={state}
        setState={setState}
        playComparatorAnimation={playComparatorAnimation}
      />
    </div>
  )
}

export default Widget
