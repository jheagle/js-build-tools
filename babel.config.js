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

// Plugins and presets by resolved path, not by name: Babel resolves names from the *project's* root, but a project
// keeps Babel 7 at its top level (Jest's own internals use it), so npm installs Babel 8 inside js-build-tools, where a
// name lookup from the project can't reach it. require.resolve here finds js-build-tools' own copies wherever they are.
module.exports = {
  plugins: [
    require.resolve('@babel/plugin-transform-modules-commonjs'),
    // Babel 8 removed preset-env's useBuiltIns/corejs options; the same polyfill injection, as its own plugin
    [require.resolve('babel-plugin-polyfill-corejs3'), { method: 'usage-global', version: '3.6', proposals: true, targets }]
  ],
  presets: [
    [require.resolve('@babel/preset-env'), { targets }]
  ]
}
