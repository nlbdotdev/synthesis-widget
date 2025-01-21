import { Dispatch, SetStateAction } from 'react'
import { WidgetState } from './Widget'
import { PlayButton } from './PlayButton'

interface ControlPanelProps {
  state: WidgetState
  setState: Dispatch<SetStateAction<WidgetState>>
  playComparatorAnimation: () => void
  resetComparison: () => void
}

const ControlPanel = ({
  state,
  setState,
  playComparatorAnimation,
  resetComparison,
}: ControlPanelProps) => {
  return (
    <div className="flex flex-row bg-gray-100 min-w-[60vw] min-h-[200px] select-none z-50">
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
                isInput: e.target.value === 'addRemove',
              })
            }
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="none">No Interaction</option>
            <option value="addRemove">Add & Remove</option>
            <option value="drawCompare">Draw & Compare</option>
          </select>
        </label>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <span>Stack 1: </span>
            <input
              type="number"
              min="0"
              max="10"
              value={state.blockCount1}
              onChange={(e) =>
                setState({
                  ...state,
                  blockCount1: Math.min(
                    10,
                    Math.max(0, parseInt(e.target.value) || 0)
                  ),
                })
              }
              className="w-16 px-2 py-1 border rounded text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </label>
          <label className="flex items-center space-x-2">
            <span>Stack 2: </span>
            <input
              type="number"
              min="0"
              max="10"
              value={state.blockCount2}
              onChange={(e) =>
                setState({
                  ...state,
                  blockCount2: Math.min(
                    10,
                    Math.max(0, parseInt(e.target.value) || 0)
                  ),
                })
              }
              className="w-16 px-2 py-1 border rounded text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </label>
        </div>

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
          onClick={
            state.hasCompletedAnimation
              ? resetComparison
              : playComparatorAnimation
          }
          className="p-2 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={state.hasCompletedAnimation ? 'Reset' : 'Play'}
        >
          <PlayButton
            className="cursor-pointer"
            isReset={state.hasCompletedAnimation}
          />
        </button>
      </div>
    </div>
  )
}

export default ControlPanel
