import { Dispatch, SetStateAction } from 'react'
import { WidgetState } from './Widget'
import { PlayButton } from './PlayButton'

interface ControlPanelProps {
  state: WidgetState
  setState: Dispatch<SetStateAction<WidgetState>>
  playComparatorAnimation: () => void
}

const ControlPanel = ({
  state,
  setState,
  playComparatorAnimation,
}: ControlPanelProps) => {
  return (
    <div className="flex flex-row bg-gray-100 min-w-[60vw] min-h-[200px] select-none">
      <div className="w-2/3 flex flex-col items-start justify-center space-y-4 px-8">
        <label className="flex items-center space-x-2">
          <span>Interaction Mode: </span>
          <select
            value={state.interactionMode}
            onChange={(e) =>
              setState({
                ...state,
                interactionMode: e.target
                  .value as WidgetState['interactionMode'],
              })
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
            checked={state.isInput}
            onChange={(e) => setState({ ...state, isInput: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
        </label>
        <label className="flex items-center space-x-2">
          <span>Show Comparator:</span>
          <input
            type="checkbox"
            checked={state.showComparator}
            onChange={(e) =>
              setState({ ...state, showComparator: e.target.checked })
            }
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
        </label>
        <label className="flex items-center space-x-2">
          <span>Show Comparator Lines:</span>
          <input
            type="checkbox"
            checked={state.showComparatorLines}
            onChange={(e) =>
              setState({ ...state, showComparatorLines: e.target.checked })
            }
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
