import React, { Component } from 'react'
import { graphql } from 'gatsby'
import { uniq } from 'lodash'

import { Layout } from '../layout'
import { Bio } from '../components/bio'
import { Head } from '../components/head'
import { Category } from '../components/category'
import HomeContainer from '../containers/home'

export default class BlogIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentCategory: '',
    }

    this.selectCategory = this.selectCategory.bind(this)
  }

  selectCategory(value) {
    this.setState({
      currentCategory: value,
    })
  }

  render() {
    const { currentCategory } = this.state
    const { data } = this.props
    const { siteMetadata } = data.site
    const { countOfInitialPost } = siteMetadata.configs
    const posts = data.allMarkdownRemark.edges
    const category = uniq(posts.map(({ node }) => node.frontmatter.category))

    return (
      <Layout location={this.props.location} title={siteMetadata.title}>
        <Head title="FELog | Home" keywords={siteMetadata.keywords} />
        <Bio />
        <Category category={category} selectCategory={this.selectCategory} />
        <HomeContainer
          currentCategory={currentCategory}
          countOfInitialPost={countOfInitialPost}
          posts={posts}
        />
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
            category
          }
        }
      }
    }
  }
`
