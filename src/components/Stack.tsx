import { InteractionMode } from './Widget'
import { Cube } from './Cube'
import { motion } from 'framer-motion'
import React from 'react'

interface BlocksProps {
  count: number
  setCount: (count: number) => void
  interactionMode: InteractionMode
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

// Block Component with Dragging
const DRAG_THRESHOLD_X = 150
const DRAG_THRESHOLD_Y = 200
const SCALE_INITIAL = 0.1
const SCALE_NORMAL = 1
const SCALE_HOVER = 1.2
const SCALE_DRAG = 1.4

const Block = ({
  index,
  count,
  setCount,
  interactionMode,
}: {
  index: number
  count: number
  setCount: (count: number) => void
  interactionMode: InteractionMode
}) => {
  const [isOutside, setIsOutside] = React.useState(false)
  const [startPoint, setStartPoint] = React.useState({ x: 0, y: 0 })

  const handleDragStart = (event: any, info: any) => {
    console.log('drag start')
    console.log('x:', info.point.x, 'y:', info.point.y)
    setStartPoint({ x: info.point.x, y: info.point.y })
  }

  const handleDrag = (event: any, info: any) => {
    const deltaX = info.point.x - startPoint.x
    const deltaY = info.point.y - startPoint.y
    const isOutsideBounds =
      Math.abs(deltaX) > DRAG_THRESHOLD_X || Math.abs(deltaY) > DRAG_THRESHOLD_Y
    setIsOutside(isOutsideBounds)
  }

  const handleDragEnd = (event: any, info: any) => {
    console.log('drag end')
    console.log('x:', info.point.x, 'y:', info.point.y)

    const deltaX = info.point.x - startPoint.x
    const deltaY = info.point.y - startPoint.y
    // Check if block was dragged far enough to the sides or up/down
    if (
      interactionMode === 'addRemove' &&
      (Math.abs(deltaX) > DRAG_THRESHOLD_X ||
        Math.abs(deltaY) > DRAG_THRESHOLD_Y)
    ) {
      setCount(Math.max(0, count - 1))
    }
    setIsOutside(false)
  }

  return (
    <motion.div
      initial={{ scale: SCALE_INITIAL }}
      animate={{ scale: SCALE_NORMAL }}
      drag={true}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: SCALE_DRAG }}
      whileHover={{ scale: SCALE_HOVER }}
      className="-mt-2 first:mt-0"
      style={{ zIndex: count - index }} // Higher cubes get higher z-index
    >
      <Cube isOutside={isOutside} />
    </motion.div>
  )
}

// Blocks Component
const Blocks = ({ count, setCount, interactionMode }: BlocksProps) => {
  return (
    <div className="flex flex-col items-center">
      {Array.from({ length: count }).map((_, index) => (
        <Block
          key={index}
          index={index}
          count={count}
          setCount={setCount}
          interactionMode={interactionMode}
        />
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
      //   onClick={handleClick}
      //   onContextMenu={handleContextMenu}
    >
      <Blocks
        count={count}
        setCount={setCount}
        interactionMode={interactionMode}
      />
    </div>
  )
}

// Count Input Component
const CountInput = ({ count, setCount }: CountInputProps) => {
  return (
    <div className="flex items-center space-x-2 mb-4 select-none">
      <button
        onClick={() => setCount(Math.max(0, count - 1))}
        disabled={count === 0}
        className={`w-8 h-8 flex items-center justify-center text-white rounded focus:outline-none select-none ${
          count === 0
            ? 'bg-red-300 cursor-not-allowed'
            : 'bg-red-500 hover:bg-red-600'
        }`}
      >
        -
      </button>
      <input
        type="number"
        value={count}
        onFocus={(e) => e.target.select()}
        onChange={(e) => {
          const value = e.target.value === '' ? 0 : parseInt(e.target.value)
          if (!isNaN(value)) {
            setCount(Math.min(10, Math.max(0, value)))
          }
        }}
        className="w-16 px-2 py-1 border rounded text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none select-none"
      />
      <button
        onClick={() => setCount(Math.min(10, count + 1))}
        disabled={count === 10}
        className={`w-8 h-8 flex items-center justify-center text-white rounded focus:outline-none select-none ${
          count === 10
            ? 'bg-green-300 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-600'
        }`}
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
          <div className="mb-4 select-none">{count}</div>
        )}
      </div>
    </div>
  )
}

export default Stack
