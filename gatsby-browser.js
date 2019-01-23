// custom typefaces
import 'typeface-noto-sans-kr'
import 'typeface-catamaran'
import meta from './gatsby-meta-config'

exports.onInitialClientRender = () => {
  window.fbAsyncInit = function() {
    FB.init({
      appId: meta.share.facebookAppId,
      xfbml: true,
      version: 'v3.2',
    })
    FB.AppEvents.logPageView()
  }
  ;(function(d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0]
    if (d.getElementById(id)) {
      return
    }
    js = d.createElement(s)
    js.id = id
    js.src = 'https://connect.facebook.net/en_US/sdk.js'
    fjs.parentNode.insertBefore(js, fjs)
  })(document, 'script', 'facebook-jssdk')
}
