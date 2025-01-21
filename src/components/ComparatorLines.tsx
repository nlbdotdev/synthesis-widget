import { motion } from 'framer-motion'
import { useRef } from 'react'
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
  onLineDrawStart: (point: Point) => void
  onLineDrawEnd: (point: Point) => void
  onLineDrawMove: (point: Point) => void
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
}: ComparatorLinesProps) => {
  const svgRef = useRef<SVGSVGElement>(null)

  const getRelativeCoordinates = (e: React.MouseEvent): Point | null => {
    if (!svgRef.current) return null

    const svg = svgRef.current
    const rect = svg.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    return { x, y }
  }

  // Helper to determine if endpoint is valid
  const isValidEndpoint = (point: Point, lineType: 'top' | 'bottom') => {
    return (
      point.x >= 66 &&
      ((lineType === 'top' && point.y < 50) ||
        (lineType === 'bottom' && point.y >= 50))
    )
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const point = getRelativeCoordinates(e)
    if (point) onLineDrawStart(point)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    const point = getRelativeCoordinates(e)
    if (point) onLineDrawMove(point)
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    const point = getRelativeCoordinates(e)
    if (point) onLineDrawEnd(point)
  }

  return (
    <motion.svg
      ref={svgRef}
      className={`absolute inset-0 w-full h-full ${
        interactionMode === 'drawCompare'
          ? 'pointer-events-auto'
          : 'pointer-events-none'
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
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
            isValidEndpoint(currentLine.end, currentLine.type)
              ? currentLine.type === 'top'
                ? '#2563eb'
                : '#1d4ed8'
              : '#ef4444'
          }
          strokeWidth="4"
          strokeDasharray="5,5"
          markerEnd={
            isValidEndpoint(currentLine.end, currentLine.type)
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
