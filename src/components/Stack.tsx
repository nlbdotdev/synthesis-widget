import { InteractionMode } from './Widget'

interface BlocksProps {
  count: number
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

// Count Input Component
const CountInput = ({ count, setCount }: CountInputProps) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <button
        onClick={() => setCount(Math.max(0, count - 1))}
        className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
      >
        -
      </button>
      <input
        type="number"
        value={count}
        onChange={(e) =>
          setCount(Math.min(10, Math.max(0, parseInt(e.target.value) || 0)))
        }
        className="w-16 px-2 py-1 border rounded text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        onClick={() => setCount(Math.min(10, count + 1))}
        className="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
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
    <div className="flex flex-col justify-center items-center bg-gray-100 min-h-[50vh] min-w-[200px]">
      <div className="flex-grow flex items-center">
        <Blocks count={count} />
      </div>
      {isInput ? (
        <CountInput count={count} setCount={setCount} />
      ) : (
        <div className="mb-4">{count}</div>
      )}
    </div>
  )
}

export default Stack
