import { useState, useRef, useEffect } from 'react'
import Stack from './Stack'
import ControlPanel from './ControlPanel'
import ComparatorLines from './ComparatorLines'
import { WidgetState } from '../types/widget'
import { generateComparatorLines } from '../utils/stackUtils'
import { useLineDrawing } from '../hooks/useLineDrawing'
import { useComparatorAnimation } from '../hooks/useComparatorAnimation'

const Widget = () => {
  const leftStackRef = useRef<HTMLDivElement>(null)
  const rightStackRef = useRef<HTMLDivElement>(null)

  const [state, setState] = useState<WidgetState>({
    blockCount1: 4,
    blockCount2: 2,
    interactionMode: 'none',
    isInput: false,
    showComparatorLines: false,
    drawnLines: [],
    comparatorLines: [],
    isDrawing: false,
    currentLine: null,
    autoSnapLines: true,
    isAnimating: false,
    animationOperator: '',
    animationLines: [],
    hasCompletedAnimation: false,
  })

  const { handleLineDrawStart, handleLineDrawMove, handleLineDrawEnd } =
    useLineDrawing({
      state,
      setState,
      leftStackRef,
      rightStackRef,
    })

  const { playComparatorAnimation, resetComparison } = useComparatorAnimation({
    state,
    setState,
  })

  // Add this effect to update comparator lines when block counts change
  useEffect(() => {
    // Add a small delay to allow blocks to finish scaling animation
    const timer = setTimeout(() => {
      const newComparatorLines = generateComparatorLines(
        leftStackRef.current,
        rightStackRef.current
      )
      setState((prev) => ({
        ...prev,
        comparatorLines: newComparatorLines,
      }))
    }, 100) // Match this with the block scale animation duration

    return () => clearTimeout(timer)
  }, [state.blockCount1, state.blockCount2, state.drawnLines])

  return (
    <div className="flex flex-col items-center h-screen">
      <div className="flex flex-row items-center justify-center gap-64 w-full h-full px-16">
        <div className="relative ">
          <div className="absolute left-1/2 -translate-x-1/2 w-[30px] bg-[#c3d9d4] blur-[50px] h-full" />
          <div ref={leftStackRef} className="h-full">
            <Stack
              count={state.blockCount1}
              setCount={(count) => setState({ ...state, blockCount1: count })}
              isInput={state.isInput}
              interactionMode={state.interactionMode}
            />
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 w-[30px]  bg-[#c3d9d4] blur-[50px] h-full" />
          <div ref={rightStackRef} className="h-full">
            <Stack
              count={state.blockCount2}
              setCount={(count) => setState({ ...state, blockCount2: count })}
              isInput={state.isInput}
              interactionMode={state.interactionMode}
            />
          </div>
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
          rightStackRef={rightStackRef.current}
          isAnimating={state.isAnimating}
          animationOperator={state.animationOperator}
          animationLines={state.drawnLines}
          hasCompletedAnimation={state.hasCompletedAnimation}
        />
      </div>
      <ControlPanel
        state={state}
        setState={setState}
        playComparatorAnimation={playComparatorAnimation}
        resetComparison={resetComparison}
      />
    </div>
  )
}

export default Widget
