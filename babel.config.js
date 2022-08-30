module.exports = {
  plugins: [
    '@babel/plugin-proposal-throw-expressions'
  ],
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'usage',
      corejs: { version: '3.6', proposals: true }
    }]
  ]
}
