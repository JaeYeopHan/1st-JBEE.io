import React, { useRef, useMemo } from 'react'
import { rhythm } from '../../utils/typography'
import './index.scss'
import { Item } from './item'

export const Category = ({ categories, category, selectCategory }) => {
  const tabContainerRef = useRef(null)
  const viewPortWidth = useMemo(() => document.documentElement.clientWidth);

  const scrollToCenter = tabRef => {
    const { offsetWidth } = tabRef.current
    const { left } = tabRef.current.getBoundingClientRect();
    const { scrollLeft } = tabContainerRef.current

    const targetScollX = scrollLeft + left - offsetWidth / 2 - viewPortWidth / 4

    tabContainerRef.current.scrollTo(targetScollX, 0)
  }

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
      <Item title={'All'} category={category} selectCategory={selectCategory} scrollToCenter={scrollToCenter} />
      {categories.map((item, idx) => (
        <Item
          key={idx}
          title={item}
          category={category}
          selectCategory={selectCategory}
          scrollToCenter={scrollToCenter}
        />
      ))}
    </ul>
  )
}
