import React from 'react'
import { StaticQuery, graphql } from 'gatsby'

import { rhythm } from '../../utils/typography'

export const Bio = () => (
  <StaticQuery
    query={bioQuery}
    render={data => {
      const { author, social } = data.site.siteMetadata

      return (
        <div
          style={{
            display: `flex`,
            marginBottom: rhythm(2.5),
          }}
        >
          <p>
            Written by <strong>{author}</strong>.{` `}
            <a href={`https://twitter.com/${social.twitter}`}>Twitter</a>
            {` `}
            <a href={`https://github.com/${social.github}`}>GitHub</a>
            {` `}
            <a href={`https://medium.com/${social.medium}`}>Medium</a>
            {` `}
            <a href={`https://www.facebook.com/${social.facebook}`}>Facebook</a>
          </p>
        </div>
      )
    }}
  />
)

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        fixed(width: 50, height: 50) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        social {
          twitter
          github
          medium
          facebook
        }
      }
    }
  }
`

export default Bio
