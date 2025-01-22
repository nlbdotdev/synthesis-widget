import { Dispatch, SetStateAction, useState, useEffect } from 'react'
import { WidgetState } from './Widget'
import { motion, AnimatePresence } from 'framer-motion'

interface ControlPanelProps {
  state: WidgetState
  setState: Dispatch<SetStateAction<WidgetState>>
  playComparatorAnimation: () => void
  resetComparison: () => void
}

// Play button component merged inline
const PlayButton = ({
  className = '',
  isReset = false,
}: {
  className?: string
  isReset?: boolean
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {isReset ? (
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    ) : (
      <polygon points="5 3 19 12 5 21" />
    )}
  </svg>
)

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
  const [isVisible, setIsVisible] = useState(true)

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
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          drag
          dragMomentum={false}
          dragConstraints={constraints}
          dragElastic={0.2}
          className="fixed bottom-8 right-8 bg-gray-100 rounded-xl shadow-lg select-none z-50 max-w-sm"
          whileHover={{ scale: 1.02 }}
          whileDrag={{ scale: 1.05 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          {/* Header */}
          <div className="bg-gray-200 p-3 rounded-t-xl cursor-move flex items-center justify-between">
            <span className="font-bold text-gray-700 text-base">Controls</span>
            <div className="flex items-center gap-2">
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
              <button
                onClick={() => setIsVisible(false)}
                className="p-1.5 rounded-full hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Hide Controls"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div
            className="p-4 space-y-4"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="space-y-2">
              <label className="text-base text-gray-700">Mode</label>
              <select
                value={state.interactionMode}
                onChange={(e) => {
                  const newMode = e.target
                    .value as WidgetState['interactionMode']
                  setState({
                    ...state,
                    interactionMode: newMode,
                    isInput: newMode === 'addRemove',
                    // Clear lines when switching away from drawCompare
                    ...(newMode !== 'drawCompare' && {
                      drawnLines: [],
                      hasCompletedAnimation: false,
                      showComparator: false,
                    }),
                  })
                }}
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
                    setState({
                      ...state,
                      showComparatorLines: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Show Comparator Lines</span>
              </label>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.button
          onClick={() => setIsVisible(true)}
          className="fixed bottom-8 right-8 p-2 bg-gray-200 rounded-full shadow-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          aria-label="Show Controls"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default ControlPanel
