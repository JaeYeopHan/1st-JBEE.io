module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  plugins: ['react', 'react-hooks'],
  globals: {
    graphql: false,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true,
    },
  },
  rules: {
    'react-hooks/rules-of-hooks': 'error',
  },
}
