'use strict'

require('core-js/modules/esnext.weak-map.delete-all.js')
Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.build = void 0
const _bundle = require('./bundle.js')
const _bundleLint = require('./bundleLint.js')
const _bundleMinify = require('./bundleMinify.js')
const _partials = require('./partials.js')
const _compileReadme = require('./compileReadme.js')
const _distLint = require('./distLint.js')
const _distMinify = require('./distMinify.js')
const _gulp = require('gulp')
const gulpConfig = _interopRequireWildcard(require('../gulp.config.js'))
const _copyFonts = require('./copyFonts.js')
const _images = require('./images.js')
const _sass = require('./sass.js')
const _testFull = require('./testFull.js')
function _interopRequireWildcard (e, t) { if (typeof WeakMap === 'function') var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; let o; let i; const f = { __proto__: null, default: e }; if (e === null || typeof e !== 'object' && typeof e !== 'function') return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f) } for (const t in e) t !== 'default' && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f })(e, t) }
/**
 * Runs several processes to build and validate the project.
 * Cleans, distributes (lint and minify), bundles (lint and minify), creates the readme, then runs the tests.
 * @memberOf module:js-build-tools
 * @returns {stream.Stream}
 */
const build = (done = null) => {
  const distLintMinify = (0, _gulp.parallel)(_distLint.distLint, _distMinify.distMinify)
  const bundleLintMinify = (0, _gulp.parallel)(_bundleLint.bundleLint, _bundleMinify.bundleMinify)
  const buildActions = [_partials.clean, (0, _partials.distSeries)(), distLintMinify]
  if (gulpConfig.get('typescript.enabled')) {
    // For ts usage, we need to run the readme on the dist directly since that is where the .js files are located
    buildActions.push(_compileReadme.compileReadme)
  }
  if (gulpConfig.get('browser.enabled')) {
    // If not 'nodeOnly' then we also want to bundle for browser after we complete the dist directory
    buildActions.push(_bundle.bundle)
    buildActions.push(bundleLintMinify)
  }
  const runActions = [(0, _gulp.series)(...buildActions)]
  if (!gulpConfig.get('typescript.enabled')) {
    // Since we didn't run this in series after dist because of typescript, we need to run it now. Potentially faster here.
    runActions.push(_compileReadme.compileReadme)
  }
  runActions.push(_testFull.testFull)
  if (gulpConfig.get('fonts.enabled')) {
    // Conditionally add Fonts process
    runActions.push(_copyFonts.copyFonts)
  }
  if (gulpConfig.get('images.enabled')) {
    // Conditionally add Images process
    runActions.push(_images.images)
  }
  if (gulpConfig.get('sass.enabled')) {
    // Conditionally add SASS process
    runActions.push(_sass.sass)
  }
  return (0, _gulp.parallel)(...runActions)(done)
}
exports.build = build
