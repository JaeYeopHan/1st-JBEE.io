import React from 'react'

import './index.scss'

export const Category = ({ category, selectCategory, currentCategory }) => {
  return (
    <ul className="category-container" role="tablist">
      <li className={currentCategory === 'All' ? 'item selected' : 'item'}>
        <a href="" onClick={e => selectCategory(e, 'All')}>
          All
        </a>
      </li>
      {category.map((item, idx) => (
        <li
          key={idx}
          className={currentCategory === item ? 'item selected' : 'item'}
        >
          <a href="#" onClick={e => selectCategory(e, item)}>
            {item}
          </a>
        </li>
      ))}
    </ul>
  )
}
