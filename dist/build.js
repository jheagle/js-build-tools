'use strict'

var bundle = require('./bundle')
var bundleLint = require('./bundleLint')
var bundleMinify = require('./bundleMinify')
var clean = require('./clean')
var compileReadme = require('./compileReadme')
var dist = require('./dist')
var distLint = require('./distLint')
var distMinify = require('./distMinify')
var _require = require('gulp')
var parallel = _require.parallel
var series = _require.series
var gulpConfig = require('../gulp.config.js')
var testFull = require('./testFull')

/**
 * Runs several processes to build and validate the project.
 * Cleans, distributes (lint and minify), bundles (lint and minify), creates the readme, then runs the tests.
 * @memberOf module:js-build-tools
 */
var build = parallel(gulpConfig.get('nodeOnly') ? series(clean, dist, parallel(distLint, distMinify)) : series(clean, dist, parallel(distLint, distMinify), bundle, parallel(bundleLint, bundleMinify)), compileReadme, testFull)
module.exports = build
