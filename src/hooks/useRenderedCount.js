import { useState, useEffect, useRef, useCallback } from 'react'
import * as Storage from '../utils/storage'

export function useRenderedCount() {
  const initialCount = Storage.getCount(1)
  const [count, setCount] = useState(initialCount)
  const countRef = useRef(count)
  const increaseCount = useCallback(() => setCount((prev) => prev + 1), [])

  useEffect(() => {
    countRef.current = count
    Storage.setCount(count)
  }, [count])

  return [count, countRef, increaseCount]
}
