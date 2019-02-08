import React, { useState, useEffect } from 'react'

import { ThumbnailItem } from '../components/thumbnail-item'
import * as IOManager from '../utils/visible'
import * as Storage from '../utils/storage'
import * as Dom from '../utils/dom'
import { CATEGORY_TYPE } from '../constants'

const BASE_LINE = 80

let ticking = false

function getDistance(degree) {
  return Dom.getDocumentHeight() - degree
}

export default ({ posts, countOfInitialPost, currentCategory }) => {
  const saved = Storage.getState()
  const initialCount = saved ? saved.count : 1
  const [currentCount, setCurrentCount] = useState(initialCount)

  useEffect(() => {
    window.addEventListener(`scroll`, handleScroll, { passive: false })
    IOManager.init()

    return () => {
      window.removeEventListener(`scroll`, handleScroll, {
        passive: false,
      })
      IOManager.destroy()
    }
  }, [])

  useEffect(() => {
    IOManager.refreshObserver()
    Storage.setState({
      count: currentCount,
      category: currentCategory,
    })
  })

  useEffect(
    () => {
      setCurrentCount(1)
    },
    [currentCategory]
  )

  const handleScroll = () => {
    if (ticking) {
      return
    }

    ticking = true
    requestAnimationFrame(() => {
      const isTriggerPosition =
        getDistance(window.scrollY + window.innerHeight) < BASE_LINE

      if (!isTriggerPosition) {
        ticking = false
        return
      }

      const isNeedLoadMore = posts.length > currentCount * countOfInitialPost

      if (isNeedLoadMore && isTriggerPosition) {
        ticking = false
        return setCurrentCount(prevCount => prevCount + 1)
      }
    })
  }

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
