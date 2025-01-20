import { useState } from 'react'
import Stack from './Stack'
import ControlPanel from './ControlPanel'

export type InteractionMode = 'none' | 'addRemove' | 'drawCompare'

const Widget = () => {
  const [blockCount1, setBlockCount1] = useState(4)
  const [blockCount2, setBlockCount2] = useState(2)

  const [interactionMode, setInteractionMode] =
    useState<InteractionMode>('none')
  const [isInput, setIsInput] = useState(false)
  const [showComparator, setShowComparator] = useState(false)
  const [showComparatorLines, setShowComparatorLines] = useState(false)

  const playComparatorAnimation = () => {
    console.log('Playing comparator animation...')
  }

  return (
    <div className="flex flex-col items-center space-y-8">
      <div className="flex flex-row items-center space-x-8">
        <Stack
          count={blockCount1}
          setCount={setBlockCount1}
          isInput={isInput}
          interactionMode={interactionMode}
        />
        <Stack
          count={blockCount2}
          setCount={setBlockCount2}
          isInput={isInput}
          interactionMode={interactionMode}
        />
      </div>
      <ControlPanel
        interactionMode={interactionMode}
        setInteractionMode={setInteractionMode}
        isInput={isInput}
        setIsInput={setIsInput}
        showComparator={showComparator}
        setShowComparator={setShowComparator}
        showComparatorLines={showComparatorLines}
        setShowComparatorLines={setShowComparatorLines}
        playComparatorAnimation={playComparatorAnimation}
      />
    </div>
  )
}

export default Widget
