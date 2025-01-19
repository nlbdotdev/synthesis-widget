import { InteractionMode } from './Widget'

interface BlocksProps {
  count: number
}

interface BlocksContainerProps {
  count: number
  setCount: (count: number) => void
  interactionMode: InteractionMode
}

interface StackProps {
  count: number
  setCount: (count: number) => void
  isInput?: boolean
  interactionMode: InteractionMode
}

interface CountInputProps {
  count: number
  setCount: (count: number) => void
}

// Cube Component
const Cube = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width="50"
    height="50"
  >
    <rect
      x="10"
      y="10"
      width="80"
      height="80"
      fill="#3b82f6"
      stroke="#1e3a8a"
      strokeWidth="3"
    />
  </svg>
)

// Stack Component
const Blocks = ({ count }: BlocksProps) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <Cube key={index} />
      ))}
    </div>
  )
}

// Blocks Container Component
const BlocksContainer = ({
  count,
  setCount,
  interactionMode,
}: BlocksContainerProps) => {
  const handleClick = () => {
    if (interactionMode === 'addRemove') {
      setCount(Math.min(10, count + 1))
    }
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    if (interactionMode === 'addRemove') {
      setCount(Math.max(0, count - 1))
    }
  }

  return (
    <div
      className={`flex-grow flex items-center justify-center w-full ${
        interactionMode === 'addRemove' ? 'cursor-pointer' : ''
      }`}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      <Blocks count={count} />
    </div>
  )
}

// Count Input Component
const CountInput = ({ count, setCount }: CountInputProps) => {
  return (
    <div className="flex items-center space-x-2 mb-4 select-none">
      <button
        onClick={() => setCount(Math.max(0, count - 1))}
        className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none select-none"
      >
        -
      </button>
      <input
        type="number"
        value={count}
        onChange={(e) =>
          setCount(Math.min(10, Math.max(0, parseInt(e.target.value) || 0)))
        }
        className="w-16 px-2 py-1 border rounded text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none select-none"
      />
      <button
        onClick={() => setCount(Math.min(10, count + 1))}
        className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none select-none"
      >
        +
      </button>
    </div>
  )
}

// Parent Component
const Stack = ({
  count,
  setCount,
  isInput = false,
  interactionMode,
}: StackProps) => {
  return (
    <div className="flex flex-col justify-center items-center bg-gray-100 min-h-[70vh] min-w-[200px]">
      <BlocksContainer
        count={count}
        setCount={setCount}
        interactionMode={interactionMode}
      />
      <div className="flex items-center justify-center h-[10vh] bg-green-100 w-full">
        {isInput ? (
          <CountInput count={count} setCount={setCount} />
        ) : (
          <div className="mb-4">{count}</div>
        )}
      </div>
    </div>
  )
}

export default Stack
