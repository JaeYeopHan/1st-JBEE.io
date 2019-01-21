import React, { Component } from 'react'
import { graphql } from 'gatsby'

import { Layout } from '../layout'
import { Bio } from '../components/bio'
import { Head } from '../components/head'
import HomeContainer from '../containers/home'

export default class BlogIndex extends Component {
  render() {
    const { data } = this.props
    const { siteMetadata } = data.site
    const { countOfInitialPost } = siteMetadata.configs

    return (
      <Layout location={this.props.location} title={siteMetadata.title}>
        <Head title="FELog | Home" keywords={siteMetadata.keywords} />
        <Bio />
        <HomeContainer
          countOfInitialPost={countOfInitialPost}
          posts={data.allMarkdownRemark.edges}
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
          }
        }
      }
    }
  }
`
