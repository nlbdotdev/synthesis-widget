import { useState } from 'react'
import Stack from './Stack'
import ControlPanel from './ControlPanel'
import ComparatorLines from './ComparatorLines'
import { Point } from 'motion/react'

export type InteractionMode = 'none' | 'addRemove' | 'drawCompare'

export interface WidgetState {
  blockCount1: number
  blockCount2: number
  interactionMode: InteractionMode
  isInput: boolean
  showComparator: boolean
  showComparatorLines: boolean
  drawnLines: { start: Point; end: Point }[]
  comparatorLines: { start: Point; end: Point }[]
  isDrawing: boolean
  currentLine: { start: Point; end: Point } | null
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

  const calculateComparatorLines = () => {
    // Get the DOM elements for positioning
    const stack1Elements = document.querySelectorAll(
      '[data-stack="1"] [data-block]'
    )
    const stack2Elements = document.querySelectorAll(
      '[data-stack="2"] [data-block]'
    )
    const comparatorElement = document.querySelector('[data-comparator]')

    if (!comparatorElement) return []

    const comparatorRect = comparatorElement.getBoundingClientRect()
    const comparatorCenter = {
      x: comparatorRect.left + comparatorRect.width / 2,
      y: comparatorRect.top + comparatorRect.height / 2,
    }

    const lines: { start: Point; end: Point }[] = []
    const minCount = Math.min(state.blockCount1, state.blockCount2)

    // Create lines for matching pairs
    for (let i = 0; i < minCount; i++) {
      const block1 = stack1Elements[i]?.getBoundingClientRect()
      const block2 = stack2Elements[i]?.getBoundingClientRect()

      if (block1 && block2) {
        lines.push({
          start: {
            x: block1.right,
            y: block1.top + block1.height / 2,
          },
          end: {
            x: block2.left,
            y: block2.top + block2.height / 2,
          },
        })
      }
    }

    // Add lines for extra blocks in stack 1
    for (let i = minCount; i < state.blockCount1; i++) {
      const block = stack1Elements[i]?.getBoundingClientRect()
      if (block) {
        lines.push({
          start: {
            x: block.right,
            y: block.top + block.height / 2,
          },
          end: {
            x: comparatorCenter.x - 20,
            y: comparatorCenter.y,
          },
        })
      }
    }

    // Add lines for extra blocks in stack 2
    for (let i = minCount; i < state.blockCount2; i++) {
      const block = stack2Elements[i]?.getBoundingClientRect()
      if (block) {
        lines.push({
          start: {
            x: comparatorCenter.x + 20,
            y: comparatorCenter.y,
          },
          end: {
            x: block.left,
            y: block.top + block.height / 2,
          },
        })
      }
    }

    return lines
  }

  const playComparatorAnimation = () => {
    // Calculate correct comparator lines based on block positions
    const comparatorLines = calculateComparatorLines()
    setState({ ...state, comparatorLines })
  }

  const handleLineDrawStart = (point: Point) => {
    if (state.interactionMode !== 'drawCompare') return
    setState({
      ...state,
      isDrawing: true,
      currentLine: { start: point, end: point },
    })
  }

  const handleLineDrawMove = (point: Point) => {
    if (!state.isDrawing || !state.currentLine) return
    setState({
      ...state,
      currentLine: { ...state.currentLine, end: point },
    })
  }

  const handleLineDrawEnd = (point: Point) => {
    if (!state.isDrawing || !state.currentLine) return
    setState({
      ...state,
      isDrawing: false,
      drawnLines: [...state.drawnLines, { ...state.currentLine, end: point }],
      currentLine: null,
    })
  }

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="flex flex-row items-center justify-between w-full px-32 relative">
        <Stack
          count={state.blockCount1}
          setCount={(count) => setState({ ...state, blockCount1: count })}
          isInput={state.isInput}
          interactionMode={state.interactionMode}
        />
        <Comparator
          value1={state.blockCount1}
          value2={state.blockCount2}
          show={state.showComparator}
        />
        <Stack
          count={state.blockCount2}
          setCount={(count) => setState({ ...state, blockCount2: count })}
          isInput={state.isInput}
          interactionMode={state.interactionMode}
        />
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
