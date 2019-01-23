import React from 'react'

import './index.scss'

export const Category = ({ category }) => {
  return category.map((item, idx) => <div key={idx}>{item}</div>)
}
