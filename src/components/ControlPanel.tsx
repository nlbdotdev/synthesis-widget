import { Dispatch, SetStateAction, useState, useEffect } from 'react'
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
  const [constraints, setConstraints] = useState({
    right: 0,
    bottom: 0,
    left: -(window.innerWidth - 320),
    top: -(window.innerHeight - 400),
  })

  useEffect(() => {
    const updateConstraints = () => {
      setConstraints({
        right: 0,
        bottom: 0,
        left: -(window.innerWidth - 320),
        top: -(window.innerHeight - 400),
      })
    }

    window.addEventListener('resize', updateConstraints)
    return () => window.removeEventListener('resize', updateConstraints)
  }, [])

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={constraints}
      dragElastic={0.2}
      className="fixed bottom-8 right-8 bg-gray-100 rounded-xl shadow-lg select-none z-50 max-w-sm"
      whileHover={{ scale: 1.02 }}
      whileDrag={{ scale: 1.05 }}
    >
      {/* Header */}
      <div className="bg-gray-200 p-3 rounded-t-xl cursor-move flex items-center justify-between">
        <span className="font-bold text-gray-700 text-base">Controls</span>
        <button
          onClick={() => {
            if (state.hasCompletedAnimation) {
              resetComparison()
              setState((prev) => ({ ...prev, isInput: true }))
            } else {
              playComparatorAnimation()
            }
          }}
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
      <div className="p-4 space-y-4" onPointerDown={(e) => e.stopPropagation()}>
        <div className="space-y-2">
          <label className="text-base text-gray-700">Mode</label>
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
            className="w-full px-2 py-1.5 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-base"
          >
            <option value="none">No Interaction</option>
            <option value="addRemove">Add & Remove</option>
            <option value="drawCompare">Draw & Compare</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-base text-gray-700">Stack Values</label>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-base">Stack 1:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      blockCount1: Math.max(0, prev.blockCount1 - 1),
                    }))
                  }
                  disabled={state.blockCount1 === 0}
                  className={`w-7 h-7 flex items-center justify-center text-white rounded focus:outline-none select-none ${
                    state.blockCount1 === 0
                      ? 'bg-red-300 cursor-not-allowed'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={state.blockCount1}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) =>
                    setState({
                      ...state,
                      blockCount1: Math.min(
                        10,
                        Math.max(0, parseInt(e.target.value) || 0)
                      ),
                    })
                  }
                  className="w-14 px-2 py-1 border rounded text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-base"
                />
                <button
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      blockCount1: Math.min(10, prev.blockCount1 + 1),
                    }))
                  }
                  disabled={state.blockCount1 === 10}
                  className={`w-7 h-7 flex items-center justify-center text-white rounded focus:outline-none select-none ${
                    state.blockCount1 === 10
                      ? 'bg-green-300 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-base">Stack 2:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      blockCount2: Math.max(0, prev.blockCount2 - 1),
                    }))
                  }
                  disabled={state.blockCount2 === 0}
                  className={`w-7 h-7 flex items-center justify-center text-white rounded focus:outline-none select-none ${
                    state.blockCount2 === 0
                      ? 'bg-red-300 cursor-not-allowed'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={state.blockCount2}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) =>
                    setState({
                      ...state,
                      blockCount2: Math.min(
                        10,
                        Math.max(0, parseInt(e.target.value) || 0)
                      ),
                    })
                  }
                  className="w-14 px-2 py-1 border rounded text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-base"
                />
                <button
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      blockCount2: Math.min(10, prev.blockCount2 + 1),
                    }))
                  }
                  disabled={state.blockCount2 === 10}
                  className={`w-7 h-7 flex items-center justify-center text-white rounded focus:outline-none select-none ${
                    state.blockCount2 === 10
                      ? 'bg-green-300 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-base">
            <input
              type="checkbox"
              checked={state.showComparatorLines}
              onChange={(e) =>
                setState({ ...state, showComparatorLines: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-700">Show Comparator Lines</span>
          </label>
        </div>
      </div>
    </motion.div>
  )
}

export default ControlPanel
