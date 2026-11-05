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
    // Compile import() to an interop require, as Babel 7 did. Babel 8 leaves it native when the targets support it,
    // but a native import() of a Babel-compiled CommonJS module ignores its __esModule marker, so
    // `(await import(x)).default` becomes the whole exports object instead of the default export.
    require.resolve('@babel/plugin-transform-dynamic-import'),
    // Babel 8 removed preset-env's useBuiltIns/corejs options; the same polyfill injection, as its own plugin.
    // proposals: false - no polyfills for proposed (not yet standard) features, like WeakMap.prototype.deleteAll,
    // which a class's #private fields (compiled to WeakMaps) used to pull in with ~23KB of core-js.
    // exclude iterator helpers: Babel can't tell an array's .map/.filter/.reduce/.forEach from an iterator's, so it
    // injected Iterator polyfills for every array call (most of si-funciona's dist). No project here uses iterator
    // helpers; one that does should import them from core-js itself, or the targets should rise to browsers that
    // have them (Chrome 122, Firefox 131, Safari 18.4).
    [require.resolve('babel-plugin-polyfill-corejs3'), {
      method: 'usage-global',
      version: '3.6',
      proposals: false,
      exclude: [/^(es|esnext)\.(async-)?iterator\./],
      targets
    }]
  ],
  presets: [
    [require.resolve('@babel/preset-env'), { targets }],
    // Presets run last to first, so TypeScript is stripped before preset-env compiles the result. It only acts on
    // .ts/.tsx/.mts/.cts files, so plain JavaScript projects are unaffected; projects no longer push it themselves.
    require.resolve('@babel/preset-typescript')
  ]
}
