import { Dispatch, SetStateAction } from 'react'
import { WidgetState } from './Widget'
import { PlayButton } from './PlayButton'
import { motion } from 'framer-motion'

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
    <motion.div
      drag
      dragMomentum={false}
      className="fixed bottom-8 right-8 bg-gray-100 rounded-xl shadow-lg select-none z-50"
      initial={{ y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileDrag={{ scale: 1.05 }}
    >
      {/* Header */}
      <div className="bg-gray-200 p-3 rounded-t-xl cursor-move flex items-center justify-between">
        <span className="font-medium text-gray-700">Controls</span>
        <button
          onClick={
            state.hasCompletedAnimation
              ? resetComparison
              : playComparatorAnimation
          }
          className="p-1.5 rounded-full hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={state.hasCompletedAnimation ? 'Reset' : 'Play'}
        >
          <PlayButton
            className="cursor-pointer w-5 h-5"
            isReset={state.hasCompletedAnimation}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Mode</label>
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
            className="w-full px-2 py-1.5 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm"
          >
            <option value="none">No Interaction</option>
            <option value="addRemove">Add & Remove</option>
            <option value="drawCompare">Draw & Compare</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Stack Values
          </label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm">Stack 1:</span>
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
                className="w-16 px-2 py-1 border rounded text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm">Stack 2:</span>
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
                className="w-16 px-2 py-1 border rounded text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={state.showComparatorLines}
              onChange={(e) =>
                setState({ ...state, showComparatorLines: e.target.checked })
              }
              className="w-3.5 h-3.5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="font-medium text-gray-700">Show Guide Lines</span>
          </label>
        </div>
      </div>
    </motion.div>
  )
}

export default ControlPanel
