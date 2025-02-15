import { InteractionMode } from '../types/widget'
import Block from './Block'
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
      onClick={handleClick}
      onContextMenu={handleContextMenu}
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
        className={`w-8 h-8 flex items-center justify-center text-[#0a192f] rounded focus:outline-none select-none ${
          count === 0
            ? 'bg-[#64ffda50] cursor-not-allowed'
            : 'bg-[#64ffda] hover:bg-[#64ffda90]'
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
        className="w-24 px-2 py-1 border rounded text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none select-none text-[#00d9ff] text-6xl font-bold bg-transparent border-[#64ffda] tracking-wider"
      />
      <button
        onClick={() => setCount(Math.min(10, count + 1))}
        disabled={count === 10}
        className={`w-8 h-8 flex items-center justify-center text-[#0a192f] rounded focus:outline-none select-none ${
          count === 10
            ? 'bg-[#64ffda50] cursor-not-allowed'
            : 'bg-[#64ffda] hover:bg-[#64ffda90]'
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
    <div
      data-stack={isInput ? '1' : '2'}
      className="flex flex-col justify-between h-[85vh] min-w-[300px] rounded-xl relative"
    >
      <BlocksContainer
        count={count}
        setCount={setCount}
        interactionMode={interactionMode}
      />
      <div className="flex items-center justify-center h-[10vh] w-full rounded-b-xl">
        {isInput ? (
          <CountInput count={count} setCount={setCount} />
        ) : (
          <div className="mb-4 select-none text-[#00d9ff] text-6xl font-bold tracking-wider">
            {count}
          </div>
        )}
      </div>
    </div>
  )
}

export default Stack
