import React from 'react'
import randomColor from 'randomcolor'

import './index.scss'

export const Category = ({ category, selectCategory, currentCategory }) => {
  const lists = category.map((item, idx) => {
    const color = randomColor({
      luminosity: 'dark',
      format: 'rgba',
      alpha: 0.9,
    })

    return (
      <li
        key={idx}
        className={currentCategory === item ? 'item selected' : 'item'}
        style={{
          borderColor: color,
        }}
      >
        <a href="#" style={{ color }} onClick={e => selectCategory(e, item)}>
          {item}
        </a>
      </li>
    )
  })

  return (
    <ul className="category-container" role="tablist">
      <li className={currentCategory === 'All' ? 'item selected' : 'item'}>
        <a href="" onClick={e => selectCategory(e, 'All')}>
          All
        </a>
      </li>
      {lists}
    </ul>
  )
}
