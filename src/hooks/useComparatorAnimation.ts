import { WidgetState } from '../types/widget'
import { getOperatorLinePositions } from '../components/ComparatorLines'

interface UseComparatorAnimationProps {
  state: WidgetState
  setState: React.Dispatch<React.SetStateAction<WidgetState>>
}

export const useComparatorAnimation = ({
  state,
  setState,
}: UseComparatorAnimationProps) => {
  const playComparatorAnimation = () => {
    // Only play if we have both lines drawn
    if (state.drawnLines.length !== 2) return

    // Calculate target operator based on values
    const operator =
      state.blockCount1 > state.blockCount2
        ? '>'
        : state.blockCount1 < state.blockCount2
          ? '<'
          : '='

    // Start animation sequence
    setState((prev) => ({
      ...prev,
      isAnimating: true,
      showComparator: false,
      animationOperator: operator,
      // Keep track of original line positions for animation
      animationLines: state.drawnLines.map((line) => ({
        ...line,
        originalStart: { ...line.start },
        originalEnd: { ...line.end },
      })),
    }))

    // After animation completes, show the comparator but keep the animated lines
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isAnimating: false,
        showComparator: true,
        hasCompletedAnimation: true,
        // Convert the animated lines to their final positions
        drawnLines: getOperatorLinePositions(operator, 50, 50),
      }))
    }, 1000)
  }

  const resetComparison = () => {
    setState((prev) => ({
      ...prev,
      drawnLines: [],
      animationLines: [],
      showComparator: false,
      hasCompletedAnimation: false,
      interactionMode: 'addRemove',
    }))
  }

  return {
    playComparatorAnimation,
    resetComparison,
  }
}
