// custom typefaces
require('typeface-noto-sans-kr')
require('typeface-catamaran')

const metaConfig = require('./gatsby-meta-config')
const IntersectionObserver = require('./src/utils/visible')
const FacebookSDK = require('./src/utils/facebook-sdk')

exports.onInitialClientRender = () => {
  IntersectionObserver.init()
  FacebookSDK.init(metaConfig)
}

exports.onRouteUpdate = ({ location }) => {
  if (location.pathname !== '/' || !window.refreshObserver) {
    return
  }
  window.refreshObserver()
}
