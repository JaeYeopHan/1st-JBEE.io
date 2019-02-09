import React from 'react'

import { ThumbnailItem } from '../thumbnail-item'
import { CATEGORY_TYPE } from '../../constants'

export const Contents = ({ posts, countOfInitialPost, count, category }) => {
  return posts
    .filter(
      ({ node }) =>
        category === CATEGORY_TYPE.ALL || node.frontmatter.category === category
    )
    .slice(0, count * countOfInitialPost)
    .map(({ node }, index) => (
      <ThumbnailItem node={node} key={`item_${index}`} />
    ))
}
