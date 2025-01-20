import { useState } from 'react'
import Stack from './Stack'
import ControlPanel from './ControlPanel'

export type InteractionMode = 'none' | 'addRemove' | 'drawCompare'

export interface WidgetState {
  blockCount1: number
  blockCount2: number
  interactionMode: InteractionMode
  isInput: boolean
  showComparator: boolean
  showComparatorLines: boolean
}

const Widget = () => {
  const [state, setState] = useState<WidgetState>({
    blockCount1: 4,
    blockCount2: 2,
    interactionMode: 'none',
    isInput: false,
    showComparator: false,
    showComparatorLines: false,
  })

  const playComparatorAnimation = () => {
    console.log('Playing comparator animation...')
  }

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="flex flex-row items-center space-x-8">
        <Stack
          count={state.blockCount1}
          setCount={(count) => setState({ ...state, blockCount1: count })}
          isInput={state.isInput}
          interactionMode={state.interactionMode}
        />
        <Stack
          count={state.blockCount2}
          setCount={(count) => setState({ ...state, blockCount2: count })}
          isInput={state.isInput}
          interactionMode={state.interactionMode}
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
