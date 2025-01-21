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
const SCALE_DRAG = 1.3
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

  const handleDragStart = (_event: any, info: any) => {
    setStartPoint({ x: info.point.x, y: info.point.y })
    setIsDragging(true)
  }

  const handleDrag = (_event: any, info: any) => {
    const deltaX = info.point.x - startPoint.x
    const deltaY = info.point.y - startPoint.y
    const isOutsideBounds =
      Math.abs(deltaX) > DRAG_THRESHOLD_X || Math.abs(deltaY) > DRAG_THRESHOLD_Y
    setIsOutside(isOutsideBounds)
  }

  const handleDragEnd = (_event: any, info: any) => {
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
          onClick: (e: React.MouseEvent) => {
            if (interactionMode === 'addRemove') {
              e.stopPropagation()
            }
          },
        }
      : {}

  return (
    <motion.div
      style={{
        position: 'relative',
        zIndex: isDragging ? Z_INDEX_DRAGGING : count - index,
        marginBottom: '-0.5rem',
      }}
      layout
      transition={{
        layout: {
          type: 'spring',
          damping: 15, // Lower damping for more bounce
          stiffness: 300, // Higher stiffness for faster movement
          mass: 0.8, // Slightly lower mass for quicker response
        },
      }}
    >
      <motion.div
        data-block
        initial={{ scale: SCALE_INITIAL }}
        animate={{ scale: SCALE_NORMAL }}
        transition={{
          type: 'spring',
          damping: 12,
          stiffness: 400,
          mass: 0.8,
        }}
        {...interactionProps}
      >
        <Cube isOutside={isOutside} />
      </motion.div>
    </motion.div>
  )
}

export default Block
