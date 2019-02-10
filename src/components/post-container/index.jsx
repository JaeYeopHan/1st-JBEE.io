import React from 'react'

import './index.scss'

export const PostContainer = ({ html }) => (
  <div className="post-container" dangerouslySetInnerHTML={{ __html: html }} />
)
