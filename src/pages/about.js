import React, { Component } from 'react'
import { graphql } from 'gatsby'
import { rhythm } from '../utils/typography'

export default class AboutIndex extends Component {
  render() {
    const { data } = this.props

    return (
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
      </div>
    )
  }
}

export const pageQuery = graphql`
  query {
    markdownRemark(frontmatter: { category: { eq: null } }) {
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
