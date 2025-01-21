import React from 'react'

interface Point {
  x: number
  y: number
}

interface Line {
  start: Point
  end: Point
}

interface ComparatorLinesProps {
  drawnLines: Line[]
  comparatorLines: Line[]
  currentLine: Line | null
  isDrawing: boolean
  showComparatorLines: boolean
  onLineDrawStart: (point: Point) => void
  onLineDrawEnd: (point: Point) => void
  onLineDrawMove: (point: Point) => void
}

const ComparatorLines = ({
  drawnLines,
  comparatorLines,
  currentLine,
  isDrawing,
  showComparatorLines,
  onLineDrawStart,
  onLineDrawEnd,
  onLineDrawMove,
}: ComparatorLinesProps) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    onLineDrawStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return
    const rect = e.currentTarget.getBoundingClientRect()
    onLineDrawMove({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDrawing) return
    const rect = e.currentTarget.getBoundingClientRect()
    onLineDrawEnd({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-auto"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Draw completed student lines */}
      {drawnLines.map((line, index) => (
        <line
          key={`drawn-${index}`}
          x1={line.start.x}
          y1={line.start.y}
          x2={line.end.x}
          y2={line.end.y}
          stroke="#2563eb"
          strokeWidth="2"
        />
      ))}

      {/* Draw the current line being drawn */}
      {currentLine && (
        <line
          x1={currentLine.start.x}
          y1={currentLine.start.y}
          x2={currentLine.end.x}
          y2={currentLine.end.y}
          stroke="#2563eb"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      )}

      {/* Draw comparator lines when enabled */}
      {showComparatorLines &&
        comparatorLines.map((line, index) => (
          <line
            key={`comparator-${index}`}
            x1={line.start.x}
            y1={line.start.y}
            x2={line.end.x}
            y2={line.end.y}
            stroke="#16a34a"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        ))}
    </svg>
  )
}

export default ComparatorLines
