import { useState } from 'react'
import Stack from './Stack'

export type InteractionMode = 'none' | 'addRemove' | 'drawCompare'

const Widget = () => {
  const ControlPanel = () => {
    return (
      <div className="flex flex-row items-center justify-center space-x-8 bg-gray-100 min-w-[60vw] min-h-[200px]">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isInput}
            onChange={(e) => setIsInput(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span>Enable Input Mode</span>
        </label>
        <div className="flex items-center space-x-4">
          <select
            value={interactionMode}
            onChange={(e) =>
              setInteractionMode(e.target.value as InteractionMode)
            }
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="none">No Interaction</option>
            <option value="addRemove">Add/Remove</option>
            <option value="drawCompare">Draw & Compare</option>
          </select>
        </div>
      </div>
    )
  }

  const [blockCount1, setBlockCount1] = useState(4)
  const [blockCount2, setBlockCount2] = useState(2)

  const [interactionMode, setInteractionMode] =
    useState<InteractionMode>('none')
  const [isInput, setIsInput] = useState(false)

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
      <ControlPanel />
    </div>
  )
}

export default Widget
