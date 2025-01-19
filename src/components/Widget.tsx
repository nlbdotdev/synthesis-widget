import { useState } from 'react'
import Stack from './Stack'

const Widget = () => {
  const [blockCount1, setBlockCount1] = useState(4)
  const [blockCount2, setBlockCount2] = useState(2)

  return (
    <div className="flex flex-row items-center space-x-8">
      <Stack count={blockCount1} setCount={setBlockCount1} isInput={true} />
      <Stack count={blockCount2} setCount={setBlockCount2} />
    </div>
  )
}

export default Widget
