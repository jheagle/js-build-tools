'use strict'

var bundle = require('./bundle')
var bundleLint = require('./bundleLint')
var bundleMinify = require('./bundleMinify')
var _require = require('./partials')
var clean = _require.clean
var distSeries = _require.distSeries
var compileReadme = require('./compileReadme')
var distLint = require('./distLint')
var distMinify = require('./distMinify')
var _require2 = require('gulp')
var parallel = _require2.parallel
var series = _require2.series
var gulpConfig = require('../gulp.config.js')
var testFull = require('./testFull')

/**
 * Runs several processes to build and validate the project.
 * Cleans, distributes (lint and minify), bundles (lint and minify), creates the readme, then runs the tests.
 * @memberOf module:js-build-tools
 * @returns {stream.Stream}
 */
var build = function build () {
  var done = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null
  var distLintMinify = parallel(distLint, distMinify)
  var bundleLintMinify = parallel(bundleLint, bundleMinify)
  var buildActions = [clean, distSeries(), distLintMinify]
  if (gulpConfig.get('useTsConfig')) {
    // For ts usage, we need to run the readme on the dist directly since that is where the .js files are located
    buildActions.push(compileReadme)
  }
  if (!gulpConfig.get('nodeOnly')) {
    // If not 'nodeOnly' then we also want to bundle for browser after we complete the dist directory
    buildActions.push(bundle)
    buildActions.push(bundleLintMinify)
  }
  var runActions = [series.apply(void 0, buildActions)]
  if (!gulpConfig.get('useTsConfig')) {
    // Since we didn't run this in series after dist because of typescript, we need to run it now. Potentially faster here.
    runActions.push(compileReadme)
  }
  runActions.push(testFull)
  return parallel.apply(void 0, runActions)(done)
}
module.exports = build
