import { InteractionMode } from './Widget'
import { PlayButton } from './PlayButton'

interface ControlPanelProps {
  interactionMode: InteractionMode
  setInteractionMode: (mode: InteractionMode) => void
  isInput: boolean
  setIsInput: (isInput: boolean) => void
  showComparator: boolean
  setShowComparator: (show: boolean) => void
  showComparatorLines: boolean
  setShowComparatorLines: (show: boolean) => void
  playComparatorAnimation: () => void
}

const ControlPanel = ({
  interactionMode,
  setInteractionMode,
  isInput,
  setIsInput,
  showComparator,
  setShowComparator,
  showComparatorLines,
  setShowComparatorLines,
  playComparatorAnimation,
}: ControlPanelProps) => {
  return (
    <div className="flex flex-row bg-gray-100 min-w-[60vw] min-h-[200px] select-none">
      <div className="w-2/3 flex flex-col items-start justify-center space-y-4 px-8">
        <label className="flex items-center space-x-2">
          <span>Interaction Mode: </span>
          <select
            value={interactionMode}
            onChange={(e) =>
              setInteractionMode(e.target.value as InteractionMode)
            }
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="none">No Interaction</option>
            <option value="addRemove">Add & Remove</option>
            <option value="drawCompare">Draw & Compare</option>
          </select>
        </label>
        <label className="flex items-center space-x-2">
          <span>Input Mode: </span>
          <input
            type="checkbox"
            checked={isInput}
            onChange={(e) => setIsInput(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
        </label>
        <label className="flex items-center space-x-2">
          <span>Show Comparator:</span>
          <input
            type="checkbox"
            checked={showComparator}
            onChange={(e) => setShowComparator(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
        </label>
        <label className="flex items-center space-x-2">
          <span>Show Comparator Lines:</span>
          <input
            type="checkbox"
            checked={showComparatorLines}
            onChange={(e) => setShowComparatorLines(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
        </label>
      </div>
      <div className="w-1/3 flex items-center justify-center">
        <button
          onClick={playComparatorAnimation}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Play"
        >
          <PlayButton className="cursor-pointer" />
        </button>
      </div>
    </div>
  )
}

export default ControlPanel
