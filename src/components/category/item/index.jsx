import React from 'react'

import { CATEGORY_TYPE } from '../../../constants'

export const Item = ({ title, currentCategory, selectCategory }) => (
  <li
    className="item"
    role="listitem"
    aria-selected={currentCategory === title ? 'true' : 'false'}
  >
    <div onClick={() => selectCategory(title)}>{title}</div>
  </li>
)
