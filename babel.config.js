// Explicit targets so the compiled output does not change as browserslist / caniuse-lite data moves (the same query
// resolved to different browsers on different installs). These are the versions that .browserslistrc
// ("last 2 versions, > 0.25%, not dead") resolved to when they were pinned (2026-09); raise them deliberately.
// .browserslistrc is still used by autoprefixer in the sass task.
const targets = {
  android: '150',
  chrome: '109',
  edge: '149',
  firefox: '121',
  ios: '16.6',
  opera: '127',
  opera_mobile: '80',
  safari: '18.5',
  samsung: '29'
}

module.exports = {
  plugins: [
    '@babel/plugin-transform-modules-commonjs'
  ],
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'usage',
      corejs: { version: '3.6', proposals: true },
      targets
    }]
  ]
}
