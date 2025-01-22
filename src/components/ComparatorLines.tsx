import { motion } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { InteractionMode, Line, Point } from '../types/widget'

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
  isAnimating?: boolean
  animationOperator?: string
  animationLines?: Line[]
  hasCompletedAnimation?: boolean
}

// Helper function to calculate operator line positions
export const getOperatorLinePositions = (
  operator: string,
  centerX: number,
  centerY: number
) => {
  const SIZE = 9

  switch (operator) {
    case '>':
      return [
        {
          // Top line always goes left to right
          start: { x: centerX - SIZE / 2, y: centerY - SIZE / 2 },
          end: { x: centerX + SIZE / 2, y: centerY },
          type: 'top' as const,
        },
        {
          // Bottom line always goes left to right
          start: { x: centerX - SIZE / 2, y: centerY + SIZE / 2 },
          end: { x: centerX + SIZE / 2, y: centerY },
          type: 'bottom' as const,
        },
      ]
    case '<':
      return [
        {
          // Top line always goes left to right
          start: { x: centerX - SIZE / 2, y: centerY },
          end: { x: centerX + SIZE / 2, y: centerY - SIZE / 2 },
          type: 'top' as const,
        },
        {
          // Bottom line always goes left to right
          start: { x: centerX - SIZE / 2, y: centerY },
          end: { x: centerX + SIZE / 2, y: centerY + SIZE / 2 },
          type: 'bottom' as const,
        },
      ]
    case '=':
      return [
        {
          start: { x: centerX - SIZE / 2, y: centerY - SIZE / 4 },
          end: { x: centerX + SIZE / 2, y: centerY - SIZE / 4 },
          type: 'top' as const,
        },
        {
          start: { x: centerX - SIZE / 2, y: centerY + SIZE / 4 },
          end: { x: centerX + SIZE / 2, y: centerY + SIZE / 4 },
          type: 'bottom' as const,
        },
      ]
    default:
      return []
  }
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
  isAnimating = false,
  animationOperator = '',
  animationLines = [],
  hasCompletedAnimation = false,
}: ComparatorLinesProps) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const hasMoved = useRef(false)
  const isTouch = useRef(false)

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

  // Calculate center position for operator animation
  const centerX = 50 // Center of SVG viewport
  const centerY = 50 // Exact middle of viewport (was 35)

  const targetOperatorLines = isAnimating
    ? getOperatorLinePositions(animationOperator, centerX, centerY)
    : []

  return (
    <motion.svg
      ref={svgRef}
      className={`absolute inset-0 w-full h-full ${
        interactionMode === 'drawCompare'
          ? 'pointer-events-auto'
          : 'pointer-events-none'
      }`}
      onMouseDown={(e) => {
        if (isTouch.current || currentLine) {
          e.preventDefault()
          return
        }

        isTouch.current = false
        const rect = e.currentTarget.getBoundingClientRect()
        const point = getPointFromEvent(e, rect)
        if (point) onLineDrawStart(point, false)
      }}
      onTouchStart={(e) => {
        if (currentLine) {
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
        if (!currentLine || isTouch.current) return
        const rect = e.currentTarget.getBoundingClientRect()
        const point = getPointFromEvent(e, rect)
        if (point) onLineDrawEnd(point, false)
      }}
      onTouchEnd={(_e) => {
        if (!currentLine) return
        if (!hasMoved.current) {
          onLineDrawEnd({ x: -1, y: -1 }, true)
        } else if (currentLine.end) {
          onLineDrawEnd(currentLine.end, true)
        }
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
          <circle cx="5" cy="5" r="3" fill="#ffffff" />
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

      {/* Draw completed student lines or animated operator lines */}
      {!isAnimating &&
        drawnLines.map((line, index) => (
          <motion.line
            key={`drawn-${index}`}
            initial={{
              pathLength: hasCompletedAnimation ? 1 : 0,
              x1: `${line.start.x}%`,
              y1: `${line.start.y}%`,
              x2: hasCompletedAnimation ? `${line.end.x}%` : `${line.start.x}%`,
              y2: hasCompletedAnimation ? `${line.end.y}%` : `${line.start.y}%`,
            }}
            animate={{
              pathLength: 1,
              x1: `${line.start.x}%`,
              y1: `${line.start.y}%`,
              x2: `${line.end.x}%`,
              y2: `${line.end.y}%`,
            }}
            transition={{
              pathLength: { duration: hasCompletedAnimation ? 0 : 0.2 },
              x1: { type: 'spring', stiffness: 150, damping: 15 },
              y1: { type: 'spring', stiffness: 150, damping: 15 },
              x2: { type: 'spring', stiffness: 150, damping: 15 },
              y2: { type: 'spring', stiffness: 150, damping: 15 },
            }}
            stroke={hasCompletedAnimation ? '#4ade80' : '#bfdbfe'}
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
          />
        ))}

      {/* Animated operator lines */}
      {isAnimating &&
        targetOperatorLines.map((targetLine) => {
          const originalLine = animationLines.find(
            (line) => line.type === targetLine.type
          )
          if (!originalLine) return null

          return (
            <motion.line
              key={`operator-${targetLine.type}`}
              initial={{
                x1: `${originalLine.start.x}%`,
                y1: `${originalLine.start.y}%`,
                x2: `${originalLine.end.x}%`,
                y2: `${originalLine.end.y}%`,
              }}
              animate={{
                x1: `${targetLine.start.x}%`,
                y1: `${targetLine.start.y}%`,
                x2: `${targetLine.end.x}%`,
                y2: `${targetLine.end.y}%`,
              }}
              transition={{
                duration: 1,
                ease: 'easeInOut',
              }}
              stroke="#4ade80"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              style={{
                transformOrigin:
                  animationOperator === '>' ? '100% 50%' : '0% 50%',
                transformBox: 'fill-box',
              }}
            />
          )
        })}

      {/* Add boom animation for completed animation */}
      {hasCompletedAnimation && (
        <motion.circle
          cx="50%"
          cy="50%"
          initial={{ r: 0, opacity: 0.8 }}
          animate={{ r: 200, opacity: 0 }}
          transition={{
            duration: 0.8,
            ease: 'easeOut',
          }}
          fill="#4ade80"
        />
      )}

      {/* Draw the current line being drawn */}
      {currentLine && (
        <motion.line
          x1={`${currentLine.start.x}%`}
          y1={`${currentLine.start.y}%`}
          x2={`${currentLine.end.x}%`}
          y2={`${currentLine.end.y}%`}
          stroke={
            isValidEndpoint(currentLine.end, rightStackRef, currentLine.type)
              ? '#bfdbfe'
              : '#ef4444'
          }
          strokeWidth="16"
          strokeDasharray="50,25"
          strokeLinecap="round"
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
            initial={{
              pathLength: 0,
              x1: `${line.start.x}%`,
              y1: `${line.start.y}%`,
              x2: `${line.start.x}%`, // Start from the same x,y as start
              y2: `${line.start.y}%`,
            }}
            animate={{
              pathLength: 1,
              x1: `${line.start.x}%`,
              y1: `${line.start.y}%`,
              x2: `${line.end.x}%`,
              y2: `${line.end.y}%`,
            }}
            transition={{
              pathLength: { duration: 0.3 },
              x1: { type: 'spring', stiffness: 150, damping: 15 },
              y1: { type: 'spring', stiffness: 150, damping: 15 },
              x2: { type: 'spring', stiffness: 150, damping: 15 },
              y2: { type: 'spring', stiffness: 150, damping: 15 },
            }}
            stroke="#94a3b8"
            strokeWidth="16"
            strokeDasharray="5,5"
            strokeOpacity="0.5"
            strokeLinecap="round"
          />
        ))}
    </motion.svg>
  )
}

export default ComparatorLines
