import React from 'react'
import { Link } from 'gatsby'

import './index.scss'

export const ThumbnailItem = ({ node }) => (
  <Link className="thumbnail" to={node.fields.slug}>
    <div key={node.fields.slug}>
      <h3>{node.frontmatter.title || node.fields.slug}</h3>
      <small>{node.frontmatter.date}</small>
      <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
    </div>
  </Link>
)
