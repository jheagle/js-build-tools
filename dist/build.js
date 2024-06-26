'use strict'

require('core-js/modules/esnext.weak-map.delete-all.js')
Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.build = void 0
var _bundle = require('./bundle.js')
var _bundleLint = require('./bundleLint.js')
var _bundleMinify = require('./bundleMinify.js')
var _partials = require('./partials.js')
var _compileReadme = require('./compileReadme.js')
var _distLint = require('./distLint.js')
var _distMinify = require('./distMinify.js')
var _gulp = require('gulp')
var gulpConfig = _interopRequireWildcard(require('../gulp.config.js'))
var _copyFonts = require('./copyFonts.js')
var _images = require('./images.js')
var _sass = require('./sass.js')
var _testFull = require('./testFull.js')
function _getRequireWildcardCache (e) { if (typeof WeakMap !== 'function') return null; var r = new WeakMap(); var t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r })(e) }
function _interopRequireWildcard (e, r) { if (!r && e && e.__esModule) return e; if (e === null || typeof e !== 'object' && typeof e !== 'function') return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }; var a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if (u !== 'default' && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u] } return n.default = e, t && t.set(e, n), n }
/**
 * Runs several processes to build and validate the project.
 * Cleans, distributes (lint and minify), bundles (lint and minify), creates the readme, then runs the tests.
 * @memberOf module:js-build-tools
 * @returns {stream.Stream}
 */
const build = function () {
  const done = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null
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
