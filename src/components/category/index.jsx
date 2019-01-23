import React from 'react'
import randomColor from 'randomcolor'

import './index.scss'

export const Category = ({ category }) => {
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
        <a href="" style={{ color }}>
          {item}
        </a>
      </li>
    )
  })

  return (
    <ul className="category-container" role="tablist">
      <li className="item">
        <a href="">ALL</a>
      </li>
      {lists}
    </ul>
  )
}
