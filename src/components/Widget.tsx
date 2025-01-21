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
  comparatorLines: { start: Point; end: Point }[]
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
    console.log('Draw Start:', {
      interactionMode: state.interactionMode,
      point,
    })

    if (state.interactionMode !== 'drawCompare') {
      console.log('Not in draw mode')
      return
    }

    // Get stack elements
    const leftStack = document.querySelector('[data-stack="1"]')
    if (!leftStack) {
      console.log('Left stack not found')
      return
    }

    const stackRect = leftStack.getBoundingClientRect()
    const stackMidpoint = stackRect.top + stackRect.height / 2

    console.log('Stack bounds:', {
      left: stackRect.left,
      right: stackRect.right,
      top: stackRect.top,
      bottom: stackRect.bottom,
      midpoint: stackMidpoint,
    })

    // Determine if we're in top or bottom half of left stack
    const isTopHalf = point.y < stackMidpoint

    console.log('Position check:', {
      isWithinX: point.x >= stackRect.left && point.x <= stackRect.right,
      isWithinY: point.y >= stackRect.top && point.y <= stackRect.bottom,
      isTopHalf,
    })

    // Only allow drawing if starting from left stack
    if (
      point.x >= stackRect.left &&
      point.x <= stackRect.right &&
      point.y >= stackRect.top &&
      point.y <= stackRect.bottom
    ) {
      const lineType = isTopHalf ? 'top' : 'bottom'

      // Check if we already have a line of this type
      const hasLineOfType = state.drawnLines.some(
        (line) => line.type === lineType
      )
      console.log('Line check:', {
        lineType,
        hasLineOfType,
        existingLines: state.drawnLines,
      })

      if (!hasLineOfType) {
        setState({
          ...state,
          isDrawing: true,
          currentLine: { start: point, end: point, type: lineType },
        })
        console.log('Starting new line:', lineType)
      }
    } else {
      console.log('Click outside valid start area')
    }
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

    // Get right stack element
    const rightStack = rightStackRef.current
    if (!rightStack) return

    const stackRect = rightStack.getBoundingClientRect()
    const stackMidpoint = stackRect.top + stackRect.height / 2

    // Check if endpoint is in the correct half of right stack
    const isInCorrectHalf =
      state.currentLine.type === 'top'
        ? point.y < stackMidpoint
        : point.y >= stackMidpoint

    // Only keep the line if it ends in the correct position
    if (
      point.x >= stackRect.left &&
      point.x <= stackRect.right &&
      point.y >= stackRect.top &&
      point.y <= stackRect.bottom &&
      isInCorrectHalf
    ) {
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
      // Invalid end position - discard the line
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
            isInput={true}
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
