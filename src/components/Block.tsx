import { motion } from 'framer-motion'
import React from 'react'
import { Cube } from './Cube'
import { InteractionMode } from './Widget'

// Constants for animation and interaction
const DRAG_THRESHOLD_X = 120
const DRAG_THRESHOLD_Y = 200
const SCALE_INITIAL = 0
const SCALE_NORMAL = 1
const SCALE_HOVER = 1.2
const SCALE_DRAG = 1.4
const Z_INDEX_DRAGGING = 1000 // High z-index for dragged blocks

interface BlockProps {
  index: number
  count: number
  setCount: (count: number) => void
  interactionMode: InteractionMode
}

const Block = ({ index, count, setCount, interactionMode }: BlockProps) => {
  const [isOutside, setIsOutside] = React.useState(false)
  const [startPoint, setStartPoint] = React.useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = React.useState(false)

  const handleDragStart = (event: any, info: any) => {
    setStartPoint({ x: info.point.x, y: info.point.y })
    setIsDragging(true)
  }

  const handleDrag = (event: any, info: any) => {
    const deltaX = info.point.x - startPoint.x
    const deltaY = info.point.y - startPoint.y
    const isOutsideBounds =
      Math.abs(deltaX) > DRAG_THRESHOLD_X || Math.abs(deltaY) > DRAG_THRESHOLD_Y
    setIsOutside(isOutsideBounds)
  }

  const handleDragEnd = (event: any, info: any) => {
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
    setIsDragging(false)
  }

  const interactionProps =
    interactionMode === 'addRemove'
      ? {
          drag: true,
          dragConstraints: { left: 0, right: 0, top: 0, bottom: 0 },
          dragElastic: 0.9,
          onDragStart: handleDragStart,
          onDrag: handleDrag,
          onDragEnd: handleDragEnd,
          whileDrag: { scale: SCALE_DRAG },
          whileHover: { scale: SCALE_HOVER },
          dragMomentum: false,
          style: {
            cursor: 'grab',
          },
        }
      : {}

  return (
    <motion.div
      initial={{ scale: SCALE_INITIAL }}
      animate={{ scale: SCALE_NORMAL }}
      className="-mt-2 first:mt-0"
      style={{
        zIndex: isDragging ? Z_INDEX_DRAGGING : count - index,
      }}
      {...interactionProps}
    >
      <Cube isOutside={isOutside} />
    </motion.div>
  )
}

export default Block
