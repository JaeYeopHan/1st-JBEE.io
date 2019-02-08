import React from 'react'

import { Item } from './item'
import { rhythm } from '../../utils/typography'
import { CATEGORY_TYPE } from '../../constants'

import './index.scss'

export const Category = ({ category, selectCategory, currentCategory }) => {
  return (
    <ul
      className="category-container"
      role="list"
      id="category"
      style={{
        margin: `0 -${rhythm(3 / 4)}`,
      }}
    >
      <Item
        title={'All'}
        currentCategory={currentCategory}
        selectCategory={selectCategory}
      />
      {category.map((item, idx) => (
        <Item
          key={idx}
          title={item}
          currentCategory={currentCategory}
          selectCategory={selectCategory}
        />
      ))}
    </ul>
  )
}
