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
  })

  const playComparatorAnimation = () => {
    //    TODO
  }

  const handleLineDrawStart = (point: Point) => {
    if (state.interactionMode !== 'drawCompare') return

    const leftBounds = getStackBounds(leftStackRef.current)
    if (!leftBounds) return

    // Convert point to absolute coordinates
    const absolutePoint = {
      x: (point.x * window.innerWidth) / 100,
      y: (point.y * window.innerHeight) / 100,
    }

    // Check if point is in left stack
    const isTopHalf = absolutePoint.y < leftBounds.centerY
    const lineType = isTopHalf ? 'top' : 'bottom'

    if (isValidStartPoint(absolutePoint, leftBounds, lineType)) {
      const hasLineOfType = state.drawnLines.some(
        (line) => line.type === lineType
      )
      if (!hasLineOfType) {
        setState({
          ...state,
          isDrawing: true,
          currentLine: {
            start: {
              x: (absolutePoint.x / window.innerWidth) * 100,
              y: (absolutePoint.y / window.innerHeight) * 100,
            },
            end: {
              x: (absolutePoint.x / window.innerWidth) * 100,
              y: (absolutePoint.y / window.innerHeight) * 100,
            },
            type: lineType,
          },
        })
      }
    }
  }

  const handleLineDrawEnd = (point: Point) => {
    if (!state.isDrawing || !state.currentLine) return

    const rightBounds = getStackBounds(rightStackRef.current)
    if (!rightBounds) return

    // Convert point to absolute coordinates
    const absolutePoint = {
      x: (point.x * window.innerWidth) / 100,
      y: (point.y * window.innerHeight) / 100,
    }

    if (isValidEndPoint(absolutePoint, rightBounds, state.currentLine.type)) {
      setState({
        ...state,
        isDrawing: false,
        drawnLines: [
          ...state.drawnLines.filter(
            (line) => line.type !== state.currentLine!.type
          ),
          {
            ...state.currentLine,
            end: {
              x: (absolutePoint.x / window.innerWidth) * 100,
              y: (absolutePoint.y / window.innerHeight) * 100,
            },
          },
        ],
      })
    } else {
      setState({
        ...state,
        isDrawing: false,
        currentLine: null,
      })
    }
  }

  const handleLineDrawMove = (point: Point) => {
    if (!state.isDrawing || !state.currentLine) return
    setState({
      ...state,
      currentLine: { ...state.currentLine, end: point },
    })
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
          rightStackRef={null}
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
