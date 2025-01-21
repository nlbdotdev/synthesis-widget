import { useState, useEffect } from 'react'
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
    const container = document.querySelector('.flex.flex-row')
    if (!container) return []

    const containerRect = container.getBoundingClientRect()

    // Get the DOM elements for positioning
    const stack1Elements = document.querySelectorAll(
      '[data-stack="1"] [data-block]'
    )
    const stack2Elements = document.querySelectorAll(
      '[data-stack="2"] [data-block]'
    )

    if (!stack1Elements.length || !stack2Elements.length) return []

    const lines: Line[] = []

    // Get the top blocks from each stack
    const leftTop = stack1Elements[0].getBoundingClientRect()
    const rightTop = stack2Elements[0].getBoundingClientRect()

    // Get the bottom blocks from each stack
    const leftBottom =
      stack1Elements[stack1Elements.length - 1].getBoundingClientRect()
    const rightBottom =
      stack2Elements[stack2Elements.length - 1].getBoundingClientRect()

    // Draw top line
    lines.push({
      start: {
        x: leftTop.right - containerRect.left,
        y: leftTop.top - containerRect.top + leftTop.height / 2,
      },
      end: {
        x: rightTop.left - containerRect.left,
        y: rightTop.top - containerRect.top + rightTop.height / 2,
      },
    })

    // Draw bottom line (only if different from top line)
    if (stack1Elements.length > 1 || stack2Elements.length > 1) {
      lines.push({
        start: {
          x: leftBottom.right - containerRect.left,
          y: leftBottom.top - containerRect.top + leftBottom.height / 2,
        },
        end: {
          x: rightBottom.left - containerRect.left,
          y: rightBottom.top - containerRect.top + rightBottom.height / 2,
        },
      })
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

  // Call this whenever showComparatorLines changes
  useEffect(() => {
    if (state.showComparatorLines) {
      const lines = calculateComparatorLines()
      setState((prev) => ({ ...prev, comparatorLines: lines }))
    }
  }, [state.showComparatorLines])

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="flex flex-row items-center justify-between w-full px-32 relative">
        <div data-stack="1">
          <Stack
            count={state.blockCount1}
            setCount={(count) => setState({ ...state, blockCount1: count })}
            isInput={true}
            interactionMode={state.interactionMode}
          />
        </div>

        <div data-comparator>
          <Comparator
            value1={state.blockCount1}
            value2={state.blockCount2}
            show={state.showComparator}
          />
        </div>

        <div data-stack="2">
          <Stack
            count={state.blockCount2}
            setCount={(count) => setState({ ...state, blockCount2: count })}
            isInput={false}
            interactionMode={state.interactionMode}
          />
        </div>

        <ComparatorLines
          drawnLines={state.drawnLines}
          comparatorLines={state.comparatorLines}
          currentLine={state.currentLine}
          isDrawing={state.isDrawing}
          showComparatorLines={state.showComparatorLines}
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
