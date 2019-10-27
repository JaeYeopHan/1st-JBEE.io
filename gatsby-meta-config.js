module.exports = {
  title: `JBEE.io`,
  description: `Blog posted about front end development.`,
  author: `Jbee`,
  introduction: `Web Engineer Interested in 설계.테스트.생산성.자동화.멘토링. FEConf Organizer @FEDG`,
  siteUrl: `https://jbee.io`,
  social: {
    twitter: `JbeeLjyhanll`,
    github: `JaeYeopHan`,
    medium: ``,
    facebook: `devjbee`,
  },
  icon: `content/assets/blog-favicon.png`,
  thumbnail: `content/assets/jbee-io.png`,
  keywords: [
    `blog`,
    `javascript`,
    `web`,
    `react`,
    `vue`,
    `frontend`,
    `development`,
  ],
  siteUrl: `https://jbee.io`,
  comment: {
    disqusShortName: '',
    utterances: 'JaeYeopHan/JBEE.io',
  },
  configs: {
    countOfInitialPost: 10,
  },
  sponsor: {
    buyMeACoffeeId: 'jbee',
  },
  share: {
    facebookAppId: '829988527335744', // v3.2
  },
  ga: 'UA-79845333-3',
  sentryDsn: 'https://031a7d403c7d43c69b30e8f18c56ced0@sentry.io/1396146',
  redirectTable: [
    { fromPath: '/react/[react]-0.-intro/', toPath: '/react/react-0-intro/' },
    {
      fromPath: '/react/[react]-1.-development-environment-setup/',
      toPath: '/react/react-1-development-environment-setup/',
    },
    {
      fromPath: '/react/[react]-2.-redux-architecture/',
      toPath: '/react/react-2-redux-architecture/',
    },
    {
      fromPath: '/react/[react]-3.-react-architecture/',
      toPath: '/react/react-3-react-architecture/',
    },
  ],
}
