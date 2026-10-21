import cache from 'gulp-cache'
import { requirePeer } from './loadPeer.mjs'
import { dest, src } from 'gulp'
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
  const loaded = requirePeer('gulp-imagemin', {
    task: 'images',
    installHint,
    esmOnlyMessage: `gulp-imagemin could not be loaded because it is ESM-only. ${installHint}`,
    projectPath
  })
  return loaded && (loaded.__esModule || loaded.default) ? loaded.default : loaded
}

/**
 * Load the plugins `gulp-imagemin` exports by name (gifsicle, mozjpeg, optipng and svgo), each a promise of a plugin
 * factory, for when they need options of their own (see images.jpegQuality). Resolved like {@link loadImagemin}.
 * @memberOf module:partials
 * @param {string} [projectPath=process.cwd()] - The project directory to resolve `gulp-imagemin` from.
 * @returns {Object<string, Promise<Function>>} The plugin factories, by name.
 */
export const loadImageminPlugins = (projectPath = process.cwd()) => requirePeer('gulp-imagemin', {
  task: 'images',
  installHint,
  esmOnlyMessage: `gulp-imagemin could not be loaded because it is ESM-only. ${installHint}`,
  projectPath
})

// The plugins imagemin runs when it isn't given any, in its own order
const defaultPluginNames = ['gifsicle', 'mozjpeg', 'optipng', 'svgo']

/**
 * The plugins imagemin uses by default, with mozjpeg set to the given JPEG quality instead of its own default (75).
 * @memberOf module:partials
 * @param {number} jpegQuality - The mozjpeg quality, 0 to 100.
 * @param {Object<string, Promise<Function>>} [plugins=loadImageminPlugins()] - The plugin factories, by name.
 * @returns {Array<Promise<Function>>} The plugins, in imagemin's default order.
 */
export const imageminPlugins = (jpegQuality, plugins = loadImageminPlugins()) => defaultPluginNames.map(
  name => Promise.resolve(plugins[name]).then(makePlugin => name === 'mozjpeg' ? makePlugin({ quality: jpegQuality }) : makePlugin())
)

/**
 * Move and optimize images into the browser directory.
 * @memberOf module:partials
 * @param {string|array} [imageSrc=src/images/pattern]
 * @param {string} [imageDest=dest/image/folder]
 * @return {stream.Stream}
 */
export const imagesFor = (imageSrc = gulpConfig.get('images.from'), imageDest = gulpConfig.get('images.to')) => {
  const imagemin = loadImagemin()
  const jpegQuality = gulpConfig.get('images.jpegQuality')
  // Left unset, imagemin runs its default plugins with their own defaults
  const plugins = jpegQuality ? imageminPlugins(jpegQuality) : undefined
  // Gulp 5 reads files as utf8 text unless told otherwise, which corrupts binary images (and makes gulp-cache drop them).
  return src(imageSrc, { encoding: false })
    .pipe(
      // Caching images that ran through imagemin
      cache(
        imagemin(plugins, {
          interlaced: true,
          silent: true,
          verbose: false,
        }),
        // gulp-cache keys on the file's contents alone, so keep each quality's results apart
        { name: jpegQuality ? `jpeg-quality-${jpegQuality}` : 'default' }
      )
    )
    .pipe(dest(imageDest))
}
