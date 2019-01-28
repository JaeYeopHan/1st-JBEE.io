import React from 'react'

import './index.scss'

export const ToTop = ({ onClick }) => (
  <button className="toTop" onClick={onClick}>
    <span className="text">↑</span>
  </button>
)
