import React, { useState, useEffect, useRef } from 'react'
import { graphql } from 'gatsby'
import { uniq } from 'lodash'

import { Layout } from '../layout'
import { Bio } from '../components/bio'
import { Head } from '../components/head'
import { Category } from '../components/category'
import { Contents } from '../components/contents'

import * as ScrollManager from '../utils/scroll'
import * as Storage from '../utils/storage'
import * as IOManager from '../utils/visible'
import * as Dom from '../utils/dom'

import { HOME_TITLE, CATEGORY_TYPE } from '../constants'

const DEST_POS = 360
const BASE_LINE = 80

let ticking = false

function getDistance(degree) {
  return Dom.getDocumentHeight() - degree
}

export default ({ data, location }) => {
  const saved = Storage.getState()

  const initialCount = (saved && saved.count) || 1
  const [currentCount, setCurrentCount] = useState(initialCount)
  const previousCount = useRef()

  const initialCategory = (saved && saved.category) || CATEGORY_TYPE.ALL
  const [currentCategory, setCategory] = useState(initialCategory)

  const { siteMetadata } = data.site
  const { countOfInitialPost } = siteMetadata.configs
  const posts = data.allMarkdownRemark.edges
  const category = uniq(posts.map(({ node }) => node.frontmatter.category))

  useEffect(() => {
    window.addEventListener(`scroll`, handleScroll, { passive: false })
    IOManager.init()
    ScrollManager.init()

    return () => {
      window.removeEventListener(`scroll`, handleScroll, {
        passive: false,
      })
      IOManager.destroy()
      ScrollManager.destroy()
    }
  }, [])

  useEffect(() => {
    previousCount.current = currentCount
    IOManager.refreshObserver()
    Storage.setState({
      count: currentCount,
      category: currentCategory,
    })
  })

  const selectCategory = category => {
    setCategory(category)
    ScrollManager.go(DEST_POS)
  }

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

      const isNeedLoadMore =
        posts.length > previousCount.current * countOfInitialPost

      if (isNeedLoadMore && isTriggerPosition) {
        ticking = false
        return setCurrentCount(prevCount => prevCount + 1)
      }
    })
  }

  return (
    <Layout location={location} title={siteMetadata.title}>
      <Head title={HOME_TITLE} keywords={siteMetadata.keywords} />
      <Bio />
      <Category
        category={category}
        currentCategory={currentCategory}
        selectCategory={selectCategory}
      />
      <Contents
        posts={posts}
        countOfInitialPost={countOfInitialPost}
        currentCount={currentCount}
        currentCategory={currentCategory}
      />
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        configs {
          countOfInitialPost
        }
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { category: { ne: null } } }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            category
          }
        }
      }
    }
  }
`
