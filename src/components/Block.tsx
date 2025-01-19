import { motion } from 'framer-motion'
import React from 'react'
import { Cube } from './Cube'
import { InteractionMode } from './Widget'

// Constants for animation and interaction
const DRAG_THRESHOLD_X = 150
const DRAG_THRESHOLD_Y = 200
const SCALE_INITIAL = 0.1
const SCALE_NORMAL = 1
const SCALE_HOVER = 1.2
const SCALE_DRAG = 1.4

interface BlockProps {
  index: number
  count: number
  setCount: (count: number) => void
  interactionMode: InteractionMode
}

const Block = ({ index, count, setCount, interactionMode }: BlockProps) => {
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

  const interactionProps =
    interactionMode === 'addRemove'
      ? {
          drag: true,
          onDragStart: handleDragStart,
          onDrag: handleDrag,
          onDragEnd: handleDragEnd,
          whileDrag: { scale: SCALE_DRAG },
          whileHover: { scale: SCALE_HOVER },
        }
      : {}

  return (
    <motion.div
      initial={{ scale: SCALE_INITIAL }}
      animate={{ scale: SCALE_NORMAL }}
      className="-mt-2 first:mt-0"
      style={{ zIndex: count - index }} // Higher cubes get higher z-index
      {...interactionProps}
    >
      <Cube isOutside={isOutside} />
    </motion.div>
  )
}

export default Block
