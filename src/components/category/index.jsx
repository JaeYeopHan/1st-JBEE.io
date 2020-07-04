import React, { useCallback, useMemo, useRef } from 'react'
import { rhythm } from '../../utils/typography'
import './index.scss'
import { Item } from './item'

export const Category = ({ categories, category, selectCategory }) => {
  const tabContainerRef = useRef(null)
  const viewPortWidth = useMemo(() => document.documentElement.clientWidth);

  const scrollToCenter = useCallback(tabRef => {
    const tabWidth = tabRef.current.offsetWidth
    const tabLeft = tabRef.current.getBoundingClientRect().left;
    const { scrollLeft } = tabContainerRef.current

    const targetScollX = scrollLeft + tabLeft - tabWidth / 2 - viewPortWidth / 4

    tabContainerRef.current.scrollTo(targetScollX, 0)
  }, [viewPortWidth, tabContainerRef])

  return (
    <ul
      ref={tabContainerRef}
      className="category-container"
      role="tablist"
      id="category"
      style={{
        margin: `0 -${rhythm(3 / 4)}`,
      }}
    >
      <Item title={'All'} selectedCategory={category} onClick={selectCategory} scrollToCenter={scrollToCenter} />
      {categories.map((title, idx) => (
        <Item
          key={idx}
          title={title}
          selectedCategory={category}
          onClick={selectCategory}
          scrollToCenter={scrollToCenter}
        />
      ))}
    </ul>
  )
}
