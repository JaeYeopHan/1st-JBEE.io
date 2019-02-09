import React from 'react'

import { CATEGORY_TYPE } from '../../../constants'

export const Item = ({ title, category, selectCategory }) => (
  <li
    className="item"
    role="listitem"
    aria-selected={category === title ? 'true' : 'false'}
  >
    <div onClick={() => selectCategory(title)}>{title}</div>
  </li>
)
