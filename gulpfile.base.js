/**
 * Export these functions to your own project in order to customize your build pipeline.
 * @file
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 3.0.0
 * @module js-build-tools
 */

const build = require('./functions/build.js')
const bundle = require('./functions/bundle.js')
const bundleLint = require('./functions/bundleLint.js')
const bundleMinify = require('./functions/bundleMinify.js')
const compileReadme = require('./functions/compileReadme.js')
const copyFonts = require('./functions/copyFonts.js')
const defaultCmd = require('./functions/default.js')
const dist = require('./functions/dist.js')
const distLint = require('./functions/distLint.js')
const distMinify = require('./functions/distMinify.js')
const gulpConfig = require('./gulp.config.js')
const images = require('./functions/images.js')
const partials = require('./functions/partials.js')
const sass = require('./functions/sass.js')
const testFull = require('./functions/testFull.js')
const testHelpers = require('./functions/testHelpers.js')
const testQuick = require('./functions/testQuick.js')
const typescript = require('./functions/typeScript')
const watchFull = require('./functions/watchFull.js')
const watchTest = require('./functions/watchTest.js')

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
