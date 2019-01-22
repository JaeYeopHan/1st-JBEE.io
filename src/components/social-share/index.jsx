import React, { Component } from 'react'
import { FacebookIcon } from './facebook-icon'
import { TwitterIcon } from './twitter-icon'

import './index.scss'

export class SocialShare extends Component {
  render() {
    return (
      <div className="social-share">
        <FacebookIcon />
        <TwitterIcon />
      </div>
    )
  }
}
