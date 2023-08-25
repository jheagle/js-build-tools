const bundle = require('./bundle')
const bundleLint = require('./bundleLint')
const bundleMinify = require('./bundleMinify')
const clean = require('./clean')
const compileReadme = require('./compileReadme')
const dist = require('./dist')
const distLint = require('./distLint')
const distMinify = require('./distMinify')
const { parallel, series } = require('gulp')
const gulpConfig = require('../gulp.config.js')
const testFull = require('./testFull')
const typeScript = require('./typeScript')

/**
 * When using TypeScript, ensure that we process the ts first then run babel (dist)
 * @returns {Function}
 */
const distSeries = () => gulpConfig.get('useTsConfig') ? series(typeScript, dist) : dist

/**
 * Runs several processes to build and validate the project.
 * Cleans, distributes (lint and minify), bundles (lint and minify), creates the readme, then runs the tests.
 * @memberOf module:js-build-tools
 */
const build = parallel(
  gulpConfig.get('nodeOnly')
    ? series(clean, dist, parallel(distLint, distMinify))
    : series(clean, distSeries, parallel(distLint, distMinify), bundle, parallel(bundleLint, bundleMinify)),
  compileReadme,
  testFull
)

module.exports = build
