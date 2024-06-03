/**
 * Export these functions to your own project to customize your build pipeline.
 * @file
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 3.0.0
 * @module js-build-tools
 */

const build = require('./dist/build.js')
const bundle = require('./dist/bundle.js')
const bundleLint = require('./dist/bundleLint.js')
const bundleMinify = require('./dist/bundleMinify.js')
const compileReadme = require('./dist/compileReadme.js')
const copyFonts = require('./dist/copyFonts.js')
const defaultCmd = require('./dist/default.js')
const dist = require('./dist/dist.js')
const distLint = require('./dist/distLint.js')
const distMinify = require('./dist/distMinify.js')
const gulpConfig = require('./gulp.config.js')
const images = require('./dist/images.js')
const partials = require('./dist/partials.js')
const sass = require('./dist/sass.js')
const testFull = require('./dist/testFull.js')
const testHelpers = require('./dist/testHelpers.js')
const testQuick = require('./dist/testQuick.js')
const typescript = require('./dist/typeScript')
const watchFull = require('./dist/watchFull.js')
const watchTest = require('./dist/watchTest.js')

module.exports = {
  build,
  bundle,
  bundleLint,
  bundleMinify,
  copyFonts,
  defaultCmd,
  dist,
  distLint,
  distMinify,
  gulpConfig,
  images,
  partials,
  readme: compileReadme,
  sass,
  testFull,
  testHelpers,
  testQuick,
  typescript,
  watchFull,
  watchTest
}
