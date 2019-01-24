import React from 'react'
import randomColor from 'randomcolor'

import './index.scss'

export const Category = ({ category, selectCategory }) => {
  const lists = category.map((item, idx) => {
    const color = randomColor({
      luminosity: 'dark',
      format: 'rgba',
    })
    return (
      <li
        key={idx}
        className="item"
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
      <li className="item">
        <a href="" onClick={e => selectCategory(e, 'All')}>
          All
        </a>
      </li>
      {lists}
    </ul>
  )
}
