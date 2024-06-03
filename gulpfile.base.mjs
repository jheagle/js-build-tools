/**
 * import these functions to your own project to customize your build pipeline.
 * @file
 * @author Joshua Heagle <joshuaheagle@gmail.com>
 * @version 3.0.0
 * @module js-build-tools
 */
export { build } from './functions/build.mjs'
export { bundle } from './functions/bundle.mjs'
export { bundleLint } from './functions/bundleLint.mjs'
export { bundleMinify } from './functions/bundleMinify.mjs'
export { compileReadme as readme } from './functions/compileReadme.mjs'
export { copyFonts } from './functions/copyFonts.mjs'
export { defaultCmd } from './functions/default.mjs'
export { dist } from './functions/dist.mjs'
export { distLint } from './functions/distLint.mjs'
export { distMinify } from './functions/distMinify.mjs'
export * as gulpConfig from './gulp.config.mjs'
export { images } from './functions/images.mjs'
export * as partials from './functions/partials.mjs'
export { sass } from './functions/sass.mjs'
export { testFull } from './functions/testFull.mjs'
export * as testHelpers from './functions/testHelpers.mjs'
export { testQuick } from './functions/testQuick.mjs'
export { typeScript as typescript } from './functions/typeScript.mjs'
export { watchFull } from './functions/watchFull.mjs'
export { watchTest } from './functions/watchTest.mjs'
