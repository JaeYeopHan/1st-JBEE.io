import React from 'react'
import { Link } from 'gatsby'

import './index.scss'

export const Header = ({ title, location, rootPath }) => {
  const isRoot = location.pathname === rootPath
  return (
    <h1 className={isRoot ? 'home-header header' : 'post-header header'}>
      <Link to={`/`} className="link">
        {title}
      </Link>
    </h1>
  )
}
