'use strict'

var bundle = require('./bundle')
var bundleLint = require('./bundleLint')
var bundleMinify = require('./bundleMinify')
var _require = require('./partials')
var clean = _require.clean
var distSeries = _require.distSeries
var compileReadme = require('./compileReadme')
var dist = require('./dist')
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
 * @param {function} [done=null]
 * @returns {stream.Stream}
 */
var build = function build () {
  var done = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null
  return parallel(gulpConfig.get('nodeOnly') ? series(clean, dist, parallel(distLint, distMinify)) : series(clean, distSeries(), parallel(distLint, distMinify), bundle, parallel(bundleLint, bundleMinify)), compileReadme, testFull)(done)
}
module.exports = build
