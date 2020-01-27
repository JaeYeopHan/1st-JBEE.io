import React, { useEffect } from 'react'
import { graphql } from 'gatsby'

import { Head } from '../components/head'
import { rhythm } from '../utils/typography'
import * as _ from '../constants'

import '../styles/resume.scss'

export default ({ data }) => {
  const resumeData = data.site.siteMetadata.resume
  const resumes = data.allMarkdownRemark.edges
  const resume = resumes
    .filter(({ node }) => node.frontmatter.lang === _.KOREAN)
    .map(({ node }) => node)[0]

  useEffect(() => {
    console.info(_.ABOUT_HIDDEN_MESSAGE)
  }, [])

  return (
    <>
      <Head
        title={resumeData.title}
        description={resumeData.description}
        thumbnail={resumeData.thumbnail}
      />
      <div
        className="about"
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(28),
          padding: `${rhythm(0.5)} ${rhythm(3 / 4)} ${rhythm(1.5)} ${rhythm(
            3 / 4
          )}`,
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: resume.html }} />
      </div>
    </>
  )
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        resume {
          title
          description
          thumbnail
        }
      }
    }
    allMarkdownRemark(filter: { frontmatter: { category: { eq: null } } }) {
      edges {
        node {
          id
          excerpt(pruneLength: 160)
          html
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
            lang
          }
        }
      }
    }
  }
`
