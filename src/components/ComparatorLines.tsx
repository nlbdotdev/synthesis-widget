import { motion } from 'framer-motion'
import { useRef, useEffect } from 'react'
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
  onLineDrawEnd: (point: Point) => void
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

  useEffect(() => {
    // Add non-passive touch-move listener to prevent scrolling
    const element = svgRef.current
    if (!element) return

    const handleTouchMove = (e: TouchEvent) => {
      if (currentLine) {
        e.preventDefault()
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

  return (
    <motion.svg
      ref={svgRef}
      className={`absolute inset-0 w-full h-full ${
        interactionMode === 'drawCompare'
          ? 'pointer-events-auto'
          : 'pointer-events-none'
      }`}
      onMouseDown={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const point = getPointFromEvent(e, rect)
        if (point) onLineDrawStart(point, false)
      }}
      onTouchStart={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const point = getPointFromEvent(e, rect)
        if (point) onLineDrawStart(point, true)
      }}
      onClick={(e) => {
        if (!currentLine) return
        const rect = e.currentTarget.getBoundingClientRect()
        const point = getPointFromEvent(e, rect)
        if (point) onLineDrawEnd(point)
      }}
      onTouchEnd={(e) => {
        if (!currentLine) return
        if (currentLine.end) onLineDrawEnd(currentLine.end)
      }}
      onMouseMove={(e) => {
        if (!currentLine) return
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
          viewBox="0 0 20 20"
          refX="10"
          refY="10"
          markerWidth="10"
          markerHeight="10"
        >
          <circle cx="10" cy="10" r="6" fill="currentColor" />
        </marker>
        <marker
          id="dot-invalid"
          viewBox="0 0 20 20"
          refX="10"
          refY="10"
          markerWidth="10"
          markerHeight="10"
        >
          <circle cx="10" cy="10" r="6" fill="#ef4444" />
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
          strokeWidth="4"
          markerEnd="url(#dot)"
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
          strokeWidth="4"
          strokeDasharray="5,5"
          markerEnd={
            isValidEndpoint(currentLine.end, rightStackRef, currentLine.type)
              ? 'url(#dot)'
              : 'url(#dot-invalid)'
          }
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
            strokeWidth="4"
            strokeDasharray="5,5"
            markerEnd="url(#dot)"
          />
        ))}
    </motion.svg>
  )
}

export default ComparatorLines
