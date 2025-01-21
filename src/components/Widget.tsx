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

    // Check if point is in left third of the screen
    if (point.x <= 33) {
      const isTopHalf = point.y < 50
      const lineType = isTopHalf ? 'top' : 'bottom'

      // Check if we already have a line of this type
      const hasLineOfType = state.drawnLines.some(
        (line) => line.type === lineType
      )

      if (!hasLineOfType) {
        setState({
          ...state,
          isDrawing: true,
          currentLine: { start: point, end: point, type: lineType },
        })
      }
    }
  }

  const handleLineDrawEnd = (point: Point) => {
    if (!state.isDrawing || !state.currentLine) return

    // Check if endpoint is in right third of screen
    if (point.x >= 66) {
      const isInCorrectHalf =
        state.currentLine.type === 'top' ? point.y < 50 : point.y >= 50

      if (isInCorrectHalf) {
        setState({
          ...state,
          isDrawing: false,
          drawnLines: [
            ...state.drawnLines.filter(
              (line) => line.type !== state.currentLine!.type
            ),
            { ...state.currentLine, end: point },
          ],
        })
      } else {
        setState({
          ...state,
          isDrawing: false,
          currentLine: null,
        })
      }
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
