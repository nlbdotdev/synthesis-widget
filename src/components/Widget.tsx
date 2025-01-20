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

interface ComparatorProps {
  value1: number
  value2: number
  show: boolean
}

const Comparator = ({ value1, value2, show }: ComparatorProps) => {
  return (
    <div className="text-6xl font-bold px-12 mx-16 py-6 bg-gray-100 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      {show ? (value1 > value2 ? '>' : value1 < value2 ? '<' : '=') : '?'}
    </div>
  )
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
      <div className="flex flex-row items-center justify-between w-full px-32">
        <Stack
          count={state.blockCount1}
          setCount={(count) => setState({ ...state, blockCount1: count })}
          isInput={state.isInput}
          interactionMode={state.interactionMode}
        />
        <Comparator
          value1={state.blockCount1}
          value2={state.blockCount2}
          show={state.showComparator}
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
