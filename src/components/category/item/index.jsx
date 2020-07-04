import React, { useRef, useCallback, useEffect } from 'react'

export const Item = ({ title, category, selectCategory, scrollToCenter }) => {
  const tabRef = useRef(null)

  const handleClick = useCallback(() => {
    scrollToCenter(tabRef)
    selectCategory(title)
  }, [])

  useEffect(() => {
    if (category === title) {
      scrollToCenter(tabRef)
    }
  }, [category])

  return (
    <li
      ref={tabRef}
      className="item"
      role="tab"
      aria-selected={category === title ? 'true' : 'false'}
    >
      <div onClick={handleClick}>{title}</div>
    </li>
  )
}
