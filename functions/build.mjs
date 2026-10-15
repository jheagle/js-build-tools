import { bundle } from './bundle.mjs'
import { bundleMinify } from './bundleMinify.mjs'
import { clean, distSeries } from './partials.mjs'
import { compileReadme } from './compileReadme.mjs'
import { typeDocs } from './typeDocs.mjs'
import { jsdocDocs } from './jsdocDocs.mjs'
import { distMinify } from './distMinify.mjs'
import { sourceLint } from './sourceLint.mjs'
import { parallel, series } from 'gulp'
import * as gulpConfig from '../gulp.config.mjs'
import { copyFonts } from './copyFonts.mjs'
import { images } from './images.mjs'
import { sass } from './sass.mjs'
import { testFull } from './testFull.mjs'

/**
 * Runs several processes to build and validate the project.
 * Cleans and lints the source, distributes and minifies, bundles and minifies, creates the readme, then runs the
 * tests.
 * @memberOf module:js-build-tools
 * @returns {stream.Stream}
 */
export const build = (done = null) => {
  const buildActions = [distSeries(), distMinify]
  const generateDocs = gulpConfig.get('docs.enabled')
  // docs.method picks the engine explicitly; left unset (false, the default), it's inferred from
  // typescript.enabled - every existing TypeScript project's config, which never sets method, keeps producing
  // TypeDoc output exactly as it always has.
  const docsMethod = gulpConfig.get('docs.method') || (gulpConfig.get('typescript.enabled') ? 'typedoc' : 'jsdoc')
  if (generateDocs) {
    // The documentation is generated from the source itself, the readme is written by hand
    buildActions.push(docsMethod === 'jsdoc' ? jsdocDocs : typeDocs)
  } else if (gulpConfig.get('typescript.enabled')) {
    // For ts usage, we need to run the readme on the dist directly since that is where the .js files are located
    buildActions.push(compileReadme)
  }
  if (gulpConfig.get('browser.enabled')) {
    // If not 'nodeOnly' then we also want to bundle for browser after we complete the dist directory
    buildActions.push(bundle)
    buildActions.push(bundleMinify)
  }
  const runActions = [
    series(...buildActions),
  ]
  if (!generateDocs && !gulpConfig.get('typescript.enabled')) {
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
  // clean has to finish before anything writes into the output folders - images, fonts and sass all write into
  // browser/, so running clean in parallel with them races (ENOTEMPTY errors from clean, or output deleted mid-write).
  // sourceLint fixes the real source in place before anything compiles from it (distSeries, tsFor inside it), so a
  // build never reads a mix of pre- and post-fix content; clean only touches dist/browser output, so the two can
  // run alongside each other.
  return series(
    parallel(clean, sourceLint),
    parallel(...runActions)
  )(done)
}
