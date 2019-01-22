window.fbAsyncInit = function() {
  FB.init({
    appId: '829988527335744',
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

export const shareToFacebook = href => {
  window.FB.ui({
    method: 'share',
    mobile_iframe: true,
    href,
  })
}

export const shareToTwitter = (href, text) => {
  window.open(
    `https://twitter.com/share?url=${encodeURI(encodeURI(href))}&text=${text}`,
    'sharer',
    'toolbar=0,status=0,width=626,height=436'
  )
}
