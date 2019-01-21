import React from 'react'
import { graphql } from 'gatsby'

import * as Elements from '../components/elements'
import { Layout } from '../layout'
import { Bio } from '../components/bio'
import { Head } from '../components/head'
import { PostContainer } from '../components/post-container'
import { PostNavigator } from '../components/post-navigator'
import { Disqus } from '../components/disqus'

import '../styles/code.scss'

class BlogPostTemplate extends React.Component {
  render() {
    const { data, pageContext, location } = this.props
    const post = data.markdownRemark
    const metaData = data.site.siteMetadata
    const { title, comment, siteUrl } = metaData
    const { disqusShortName } = comment

    return (
      <Layout location={location} title={title}>
        <Head title={post.frontmatter.title} description={post.excerpt} />
        <h1>{post.frontmatter.title}</h1>
        <PostContainer html={post.html} />
        <Elements.Hr />
        <Bio />
        <PostNavigator pageContext={pageContext} />
        {!!disqusShortName && (
          <Disqus
            post={post}
            shortName={disqusShortName}
            siteUrl={siteUrl}
            slug={pageContext.slug}
          />
        )}
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
        siteUrl
        comment {
          disqusShortName
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`
