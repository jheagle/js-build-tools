import cache from 'gulp-cache'
import { createRequire } from 'node:module'
import { dest, src } from 'gulp'
import path from 'node:path'
import * as gulpConfig from '../../gulp.config.mjs'

const installHint = 'Add it to your project with: npm install --save-dev github:jheagle/gulp-imagemin#common-js-compatibility ' +
  '(the CommonJS-compatible fork - upstream gulp-imagemin is ESM-only and cannot be require()d by this package\'s CommonJS build).'

/**
 * Load `gulp-imagemin`, an optional peer dependency: image optimization is off by default and its binary-download
 * dependency chain is heavy, so it is only required once the images task actually runs, and it is resolved from the
 * consuming project's own directory rather than from this package.
 * @memberOf module:partials
 * @param {string} [projectPath=process.cwd()] - The project directory to resolve `gulp-imagemin` from.
 * @returns {Function} The gulp-imagemin plugin factory.
 * @throws {Error} With install instructions when gulp-imagemin is missing or is the ESM-only upstream release.
 */
export const loadImagemin = (projectPath = process.cwd()) => {
  let loaded
  try {
    loaded = createRequire(path.join(projectPath, 'package.json'))('gulp-imagemin')
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND' && /Cannot find module 'gulp-imagemin'/.test(error.message)) {
      throw new Error(`The images task needs the optional peer dependency gulp-imagemin, which is not installed. ${installHint}`)
    }
    if (error.code === 'ERR_REQUIRE_ESM') {
      throw new Error(`gulp-imagemin could not be loaded because it is ESM-only. ${installHint}`)
    }
    throw error
  }
  return loaded && (loaded.__esModule || loaded.default) ? loaded.default : loaded
}

/**
 * Move and optimize images into the browser directory.
 * @memberOf module:partials
 * @param {string|array} [imageSrc=src/images/pattern]
 * @param {string} [imageDest=dest/image/folder]
 * @return {stream.Stream}
 */
export const imagesFor = (imageSrc = gulpConfig.get('images.from'), imageDest = gulpConfig.get('images.to')) => {
  const imagemin = loadImagemin()
  // Gulp 5 reads files as utf8 text unless told otherwise, which corrupts binary images (and makes gulp-cache drop them).
  return src(imageSrc, { encoding: false })
    .pipe(
      // Caching images that ran through imagemin
      cache(
        imagemin({
          interlaced: true,
          silent: true,
          verbose: false,
        })
      )
    )
    .pipe(dest(imageDest))
}
