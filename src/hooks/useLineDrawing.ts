import { useRef } from 'react'
import { Point, Line, WidgetState } from '../types/widget'
import { isValidStartPoint, isValidEndPoint } from '../utils/lineValidation'
import {
  getStackBounds,
  getStackTopBottomPositions,
} from '../utils/stackPositions'

interface UseLineDrawingProps {
  state: WidgetState
  setState: React.Dispatch<React.SetStateAction<WidgetState>>
  leftStackRef: React.RefObject<HTMLDivElement>
  rightStackRef: React.RefObject<HTMLDivElement>
}

export const useLineDrawing = ({
  state,
  setState,
  leftStackRef,
  rightStackRef,
}: UseLineDrawingProps) => {
  const ignoreNextMouseUp = useRef(false)

  const handleLineDrawStart = (point: Point, isTouchEvent: boolean) => {
    if (state.interactionMode !== 'drawCompare') return

    const leftBounds = getStackBounds(leftStackRef.current)
    if (!leftBounds) return

    // Convert point to absolute coordinates
    const absolutePoint = {
      x: (point.x * window.innerWidth) / 100,
      y: (point.y * window.innerHeight) / 100,
    }

    // For touch events, we don't want to handle multiple starts
    if (isTouchEvent && state.isDrawing) {
      return
    }

    // Check if point is in left stack
    const isTopHalf = absolutePoint.y < leftBounds.centerY
    const lineType = isTopHalf ? 'top' : 'bottom'

    if (isValidStartPoint(absolutePoint, leftBounds, lineType)) {
      const hasLineOfType = state.drawnLines.some(
        (line) => line.type === lineType
      )
      if (!hasLineOfType) {
        const startPoint = {
          x: (absolutePoint.x / window.innerWidth) * 100,
          y: (absolutePoint.y / window.innerHeight) * 100,
        }

        setState({
          ...state,
          isDrawing: true,
          currentLine: {
            start: startPoint,
            end: startPoint,
            type: lineType,
          },
        })

        if (!isTouchEvent) {
          ignoreNextMouseUp.current = true
        }
      }
    }
  }

  const handleLineDrawMove = (point: Point) => {
    if (!state.isDrawing || !state.currentLine) return

    setState({
      ...state,
      currentLine: {
        ...state.currentLine,
        end: point,
      },
    })
  }

  const handleLineDrawEnd = (point: Point, isTouchEvent: boolean = false) => {
    if (!isTouchEvent && ignoreNextMouseUp.current) {
      ignoreNextMouseUp.current = false
      return
    }

    if (!state.currentLine) {
      return
    }

    const rightBounds = getStackBounds(rightStackRef.current)
    if (!rightBounds) return

    // Convert point to absolute coordinates
    const absolutePoint = {
      x: (point.x * window.innerWidth) / 100,
      y: (point.y * window.innerHeight) / 100,
    }

    // For touch events, if the start and end points are the same, clear the line
    if (
      isTouchEvent &&
      Math.abs(state.currentLine.start.x - state.currentLine.end.x) < 1 &&
      Math.abs(state.currentLine.start.y - state.currentLine.end.y) < 1
    ) {
      setState({
        ...state,
        isDrawing: false,
        currentLine: null,
      })
      return
    }

    if (isValidEndPoint(absolutePoint, rightBounds, state.currentLine.type)) {
      // Get the snap positions for both stacks
      const leftSnapPositions = getStackTopBottomPositions(leftStackRef.current)
      const rightSnapPositions = getStackTopBottomPositions(
        rightStackRef.current
      )

      let startPoint = state.currentLine.start
      let endPoint = {
        x: (absolutePoint.x / window.innerWidth) * 100,
        y: (absolutePoint.y / window.innerHeight) * 100,
      }

      if (state.autoSnapLines) {
        // Snap to center X and appropriate Y positions
        startPoint = leftSnapPositions
          ? {
              x: leftSnapPositions.centerX,
              y:
                state.currentLine.type === 'top'
                  ? leftSnapPositions.top.y
                  : leftSnapPositions.bottom.y,
            }
          : startPoint

        endPoint = rightSnapPositions
          ? {
              x: rightSnapPositions.centerX,
              y:
                state.currentLine.type === 'top'
                  ? rightSnapPositions.top.y
                  : rightSnapPositions.bottom.y,
            }
          : endPoint
      }

      setState((prev) => ({
        ...prev,
        isDrawing: false,
        drawnLines: [
          ...prev.drawnLines.filter(
            (line) => line.type !== prev.currentLine!.type
          ),
          {
            start: startPoint,
            end: endPoint,
            type: prev.currentLine!.type,
          } as Line,
        ],
        currentLine: null,
      }))
    } else {
      setState({
        ...state,
        isDrawing: false,
        currentLine: null,
      })
    }
  }

  return {
    handleLineDrawStart,
    handleLineDrawMove,
    handleLineDrawEnd,
  }
}
