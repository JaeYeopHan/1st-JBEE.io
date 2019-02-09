import React from 'react'

import { ThumbnailItem } from '../thumbnail-item'
import { CATEGORY_TYPE } from '../../constants'

export const Contents = ({
  posts,
  countOfInitialPost,
  currentCount,
  currentCategory,
}) => {
  return posts
    .filter(
      ({ node }) =>
        currentCategory === CATEGORY_TYPE.ALL ||
        node.frontmatter.category === currentCategory
    )
    .slice(0, currentCount * countOfInitialPost)
    .map(({ node }, index) => (
      <ThumbnailItem node={node} key={`item_${index}`} />
    ))
}
