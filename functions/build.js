const bundle = require('./bundle')
const bundleLint = require('./bundleLint')
const bundleMinify = require('./bundleMinify')
const clean = require('./clean')
const compileReadme = require('./compileReadme')
const dist = require('./dist')
const distLint = require('./distLint')
const distMinify = require('./distMinify')
const { parallel, series } = require('gulp')
const testFull = require('./testFull')

const build = parallel(
  series(clean, dist, parallel(distLint, distMinify), bundle, parallel(bundleLint, bundleMinify)),
  compileReadme,
  testFull
)

module.exports = build
