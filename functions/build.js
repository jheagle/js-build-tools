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

/**
 * Runs several processes to build and validate the project.
 * Cleans, distributes (lint and minify), bundles (lint and minify), creates the readme, then runs the tests.
 */
const build = parallel(
  gulpConfig.nodeOnly
    ? series(clean, dist, parallel(distLint, distMinify))
    : series(clean, dist, parallel(distLint, distMinify), bundle, parallel(bundleLint, bundleMinify)),
  compileReadme,
  testFull
)

module.exports = build
