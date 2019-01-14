import React from 'react'
import { Link } from 'gatsby'

import './index.scss'
import { rhythm } from '../../utils/typography'

export const ThumbnailItem = ({ node }) => (
  <Link className="thumbnail" to={node.fields.slug}>
    <div key={node.fields.slug}>
      <h3
        style={{
          marginBottom: rhythm(1 / 4),
        }}
      >
        {node.frontmatter.title || node.fields.slug}
      </h3>
      <small>{node.frontmatter.date}</small>
      <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
    </div>
  </Link>
)
