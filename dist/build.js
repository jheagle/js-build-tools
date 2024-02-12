'use strict'

require('core-js/modules/web.dom-collections.iterator.js')
const bundle = require('./bundle')
const bundleLint = require('./bundleLint')
const bundleMinify = require('./bundleMinify')
const {
  clean,
  distSeries
} = require('./partials')
const compileReadme = require('./compileReadme')
const distLint = require('./distLint')
const distMinify = require('./distMinify')
const {
  parallel,
  series
} = require('gulp')
const gulpConfig = require('../gulp.config.js')
const copyFonts = require('./copyFonts.js')
const images = require('./images.js')
const sass = require('./sass.js')
const testFull = require('./testFull')

/**
 * Runs several processes to build and validate the project.
 * Cleans, distributes (lint and minify), bundles (lint and minify), creates the readme, then runs the tests.
 * @memberOf module:js-build-tools
 * @returns {stream.Stream}
 */
const build = function () {
  const done = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null
  const distLintMinify = parallel(distLint, distMinify)
  const bundleLintMinify = parallel(bundleLint, bundleMinify)
  const buildActions = [clean, distSeries(), distLintMinify]
  if (gulpConfig.get('typescript.enabled')) {
    // For ts usage, we need to run the readme on the dist directly since that is where the .js files are located
    buildActions.push(compileReadme)
  }
  if (gulpConfig.get('browser.enabled')) {
    // If not 'nodeOnly' then we also want to bundle for browser after we complete the dist directory
    buildActions.push(bundle)
    buildActions.push(bundleLintMinify)
  }
  const runActions = [series(...buildActions)]
  if (!gulpConfig.get('typescript.enabled')) {
    // Since we didn't run this in series after dist because of typescript, we need to run it now. Potentially faster here.
    runActions.push(compileReadme)
  }
  runActions.push(testFull)
  if (gulpConfig.get('fonts.enabled')) {
    // Conditionally add Fonts process
    runActions.push(copyFonts)
  }
  if (gulpConfig.get('images.enabled')) {
    // Conditionally add Images process
    runActions.push(images)
  }
  if (gulpConfig.get('sass.enabled')) {
    // Conditionally add SASS process
    runActions.push(sass)
  }
  return parallel(...runActions)(done)
}
module.exports = build
