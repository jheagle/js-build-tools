import { bundle } from './bundle.mjs'
import { bundleLint } from './bundleLint.mjs'
import { bundleMinify } from './bundleMinify.mjs'
import { clean, distSeries } from './partials.mjs'
import { compileReadme } from './compileReadme.mjs'
import { distLint } from './distLint.mjs'
import { distMinify } from './distMinify.mjs'
import { parallel, series } from 'gulp'
import * as gulpConfig from '../gulp.config.mjs'
import { copyFonts } from './copyFonts.mjs'
import { images } from './images.mjs'
import { sass } from './sass.mjs'
import { testFull } from './testFull.mjs'

/**
 * Runs several processes to build and validate the project.
 * Cleans, distributes (lint and minify), bundles (lint and minify), creates the readme, then runs the tests.
 * @memberOf module:js-build-tools
 * @returns {stream.Stream}
 */
export const build = (done = null) => {
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
  const runActions = [
    series(...buildActions),
  ]
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
  return parallel(
    ...runActions
  )(done)
}
