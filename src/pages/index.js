import React from 'react'
import { graphql } from 'gatsby'

import { Layout } from '../layout'
import { Bio } from '../components/bio'
import { Head } from '../components/head'
import { ThumbnailItem } from '../components/thumbnail-item'

const BASE_LINE = 80
export default class BlogIndex extends React.Component {
  constructor(props) {
    super(props)

    this.totalCount = props.data.allMarkdownRemark.edges.length
    this.countOfInitialPost =
      props.data.site.siteMetadata.configs.countOfInitialPost

    this.state = {
      currentCount: 1,
    }

    this.handleScroll = this.handleScroll.bind(this)
  }

  componentDidMount() {
    window.addEventListener(`scroll`, this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener(`scroll`, this.handleScroll)
  }

  handleScroll() {
    if (!this.ticking) {
      this.ticking = true
      requestAnimationFrame(() => this.updateStatus())
    }
  }

  updateStatus() {
    const distanceToBottom =
      document.documentElement.offsetHeight -
      (window.scrollY + window.innerHeight)
    const isTriggerPosition = distanceToBottom < BASE_LINE

    if (!isTriggerPosition) {
      this.ticking = false
      return
    }

    const { totalCount, countOfInitialPost } = this
    const { currentCount } = this.state
    const isNeedLoadMore = totalCount > currentCount * countOfInitialPost

    if (isNeedLoadMore && isTriggerPosition) {
      this.setState(
        prevState => ({
          currentCount: prevState.currentCount + 1,
        }),
        () => {
          this.ticking = false
        }
      )
    }
  }

  render() {
    const { data } = this.props
    const { siteMetadata } = data.site
    const { currentCount } = this.state
    const posts = data.allMarkdownRemark.edges
    const countOfItem = currentCount * this.countOfInitialPost

    return (
      <Layout location={this.props.location} title={siteMetadata.title}>
        <Head title="FELog | Home" keywords={siteMetadata.keywords} />
        <Bio />
        {posts.slice(0, countOfItem).map(({ node }, index) => (
          <ThumbnailItem node={node} key={`item_${index}`} />
        ))}
      </Layout>
    )
  }
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
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
          }
        }
      }
    }
  }
`
