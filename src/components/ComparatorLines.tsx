import { motion } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { InteractionMode } from './Widget'

interface Point {
  x: number
  y: number
}

interface Line {
  start: Point
  end: Point
  type: 'top' | 'bottom'
}

interface ComparatorLinesProps {
  drawnLines: Line[]
  comparatorLines: Line[]
  currentLine: Line | null
  isDrawing: boolean
  showComparatorLines: boolean
  interactionMode: InteractionMode
  onLineDrawStart: (point: Point, isTouchEvent: boolean) => void
  onLineDrawEnd: (point: Point, isTouchEvent: boolean) => void
  onLineDrawMove: (point: Point) => void
  rightStackRef: HTMLDivElement | null
}

const ComparatorLines = ({
  drawnLines,
  comparatorLines,
  currentLine,
  showComparatorLines,
  interactionMode,
  onLineDrawStart,
  onLineDrawEnd,
  onLineDrawMove,
  rightStackRef,
}: ComparatorLinesProps) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const hasMoved = useRef(false)
  const isTouch = useRef(false)
  const lastTouchEnd = useRef(0)
  const lastLineEnd = useRef(0)
  const [isInCooldown, setIsInCooldown] = useState(false)

  useEffect(() => {
    const element = svgRef.current
    if (!element) return

    const handleTouchMove = (e: TouchEvent) => {
      if (currentLine) {
        e.preventDefault()
        hasMoved.current = true
      }
    }

    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    return () => {
      element.removeEventListener('touchmove', handleTouchMove)
    }
  }, [currentLine])

  const getPointFromEvent = (
    e: React.MouseEvent | React.TouchEvent,
    rect: DOMRect
  ) => {
    const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY

    if (clientX === undefined || clientY === undefined) return null

    return {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    }
  }

  // Helper to determine if endpoint is valid
  const isValidEndpoint = (
    point: Point,
    rightStackRef: HTMLDivElement | null,
    lineType: 'top' | 'bottom'
  ) => {
    if (!rightStackRef) return false

    const bounds = rightStackRef.getBoundingClientRect()
    const absolutePoint = {
      x: (point.x * window.innerWidth) / 100,
      y: (point.y * window.innerHeight) / 100,
    }

    const isInXBounds =
      absolutePoint.x >= bounds.left && absolutePoint.x <= bounds.right
    const centerY = bounds.top + bounds.height / 2
    const isInYBounds =
      lineType === 'top'
        ? absolutePoint.y >= bounds.top && absolutePoint.y <= centerY
        : absolutePoint.y > centerY && absolutePoint.y <= bounds.bottom

    return isInXBounds && isInYBounds
  }

  const startCooldown = () => {
    console.log('Starting cooldown')
    setIsInCooldown(true)
    setTimeout(() => {
      console.log('Ending cooldown')
      setIsInCooldown(false)
    }, 200)
  }

  return (
    <motion.svg
      ref={svgRef}
      className={`absolute inset-0 w-full h-full ${
        interactionMode === 'drawCompare'
          ? 'pointer-events-auto'
          : 'pointer-events-none'
      }`}
      onMouseDown={(e) => {
        console.log('Mouse down:', {
          isInCooldown,
          isTouch: isTouch.current,
          hasCurrentLine: !!currentLine,
        })

        // Don't start a new line if there's already an active one
        if (isInCooldown || isTouch.current || currentLine) {
          console.log(
            'Ignoring mouse down due to cooldown, touch, or active line'
          )
          e.preventDefault()
          return
        }

        isTouch.current = false
        const rect = e.currentTarget.getBoundingClientRect()
        const point = getPointFromEvent(e, rect)
        if (point) onLineDrawStart(point, false)
      }}
      onTouchStart={(e) => {
        console.log('Touch start:', {
          isInCooldown,
          hasCurrentLine: !!currentLine,
        })

        // Don't start a new line if there's already an active one
        if (isInCooldown || currentLine) {
          console.log('Ignoring touch start due to cooldown or active line')
          e.preventDefault()
          return
        }

        isTouch.current = true
        hasMoved.current = false
        const rect = e.currentTarget.getBoundingClientRect()
        const point = getPointFromEvent(e, rect)
        if (point) onLineDrawStart(point, true)
      }}
      onClick={(e) => {
        console.log('Click:', { currentLine, isTouch: isTouch.current })
        if (!currentLine || isTouch.current) return
        const rect = e.currentTarget.getBoundingClientRect()
        const point = getPointFromEvent(e, rect)
        if (point) {
          onLineDrawEnd(point, false)
          startCooldown()
        }
      }}
      onTouchEnd={(e) => {
        lastTouchEnd.current = Date.now()
        if (!currentLine) return
        if (!hasMoved.current) {
          onLineDrawEnd({ x: -1, y: -1 }, true)
        } else if (currentLine.end) {
          onLineDrawEnd(currentLine.end, true)
        }
        lastLineEnd.current = Date.now()
        setTimeout(() => {
          isTouch.current = false
        }, 100)
      }}
      onMouseMove={(e) => {
        if (!currentLine || isTouch.current) return
        const rect = e.currentTarget.getBoundingClientRect()
        const point = getPointFromEvent(e, rect)
        if (point) onLineDrawMove(point)
      }}
      onTouchMove={(e) => {
        if (!currentLine) return
        const rect = e.currentTarget.getBoundingClientRect()
        const point = getPointFromEvent(e, rect)
        if (point) onLineDrawMove(point)
      }}
      style={{ touchAction: 'none' }} // Prevents touch scrolling while drawing
      initial={false}
    >
      <defs>
        <marker
          id="dot"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="4"
          markerHeight="4"
        >
          <circle cx="5" cy="5" r="3" fill="currentColor" />
        </marker>
        <marker
          id="dot-invalid"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="4"
          markerHeight="4"
        >
          <circle cx="5" cy="5" r="3" fill="#ef4444" />
        </marker>
      </defs>

      {/* Draw completed student lines */}
      {drawnLines.map((line, index) => (
        <motion.line
          key={`drawn-${index}`}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3 }}
          x1={`${line.start.x}%`}
          y1={`${line.start.y}%`}
          x2={`${line.end.x}%`}
          y2={`${line.end.y}%`}
          stroke={line.type === 'top' ? '#2563eb' : '#1d4ed8'}
          strokeWidth="16"
          strokeLinecap="round"
          fill="none"
        />
      ))}

      {/* Draw the current line being drawn */}
      {currentLine && (
        <motion.line
          x1={`${currentLine.start.x}%`}
          y1={`${currentLine.start.y}%`}
          x2={`${currentLine.end.x}%`}
          y2={`${currentLine.end.y}%`}
          stroke={
            isValidEndpoint(currentLine.end, rightStackRef, currentLine.type)
              ? currentLine.type === 'top'
                ? '#2563eb'
                : '#1d4ed8'
              : '#ef4444'
          }
          strokeWidth="16"
          strokeDasharray="50,25"
          markerEnd={
            isValidEndpoint(currentLine.end, rightStackRef, currentLine.type)
              ? 'url(#dot)'
              : 'url(#dot-invalid)'
          }
          markerWidth="3"
          markerHeight="3"
        />
      )}

      {/* Draw comparator lines when enabled */}
      {showComparatorLines &&
        comparatorLines.map((line, index) => (
          <motion.line
            key={`comparator-${index}`}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
            x1={`${line.start.x}%`}
            y1={`${line.start.y}%`}
            x2={`${line.end.x}%`}
            y2={`${line.end.y}%`}
            stroke={line.type === 'top' ? '#16a34a' : '#15803d'}
            strokeWidth="16"
            strokeDasharray="5,5"
            markerEnd="url(#dot)"
          />
        ))}
    </motion.svg>
  )
}

export default ComparatorLines
