import { existsSync, readFileSync } from 'fs'
import path from 'path'
import { cacheFiles } from './cacheFiles.mjs'
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

// The packages that decide imagemin's output: the wrapper and imagemin, then each plugin with the engine it runs
const imageminPackages = [
  ['gulp-imagemin'],
  ['imagemin'],
  ['imagemin-gifsicle', 'gifsicle'],
  ['imagemin-mozjpeg', 'mozjpeg'],
  ['imagemin-optipng', 'optipng-bin'],
  ['imagemin-svgo', 'svgo']
]

/**
 * Find an installed package the way Node does, from a directory up through each node_modules folder. Reads the
 * package.json directly, so it also works for ESM-only packages that don't export it.
 * @private
 * @param {string} name
 * @param {string} fromDirectory
 * @returns {{directory: string, version: string}|undefined}
 */
const findPackage = (name, fromDirectory) => {
  for (let directory = path.resolve(fromDirectory); ; directory = path.dirname(directory)) {
    const file = path.join(directory, 'node_modules', name, 'package.json')
    if (existsSync(file)) {
      return { directory: path.dirname(file), version: JSON.parse(readFileSync(file, 'utf8')).version }
    }
    if (directory === path.dirname(directory)) {
      return undefined
    }
  }
}

/**
 * The installed versions of the packages that decide imagemin's output, so the image cache stops using results made
 * by older versions after an upgrade (see images.cacheDir).
 * @memberOf module:partials
 * @param {string} [projectPath=process.cwd()] - The project directory gulp-imagemin is installed in.
 * @returns {Object<string, string>} Each package's version by name; a package that isn't installed is left out.
 */
export const imageminVersions = (projectPath = process.cwd()) => {
  const gulpImagemin = findPackage('gulp-imagemin', projectPath)
  const versions = {}
  if (!gulpImagemin) {
    return versions
  }
  for (const [wrapper, engine] of imageminPackages) {
    const found = findPackage(wrapper, gulpImagemin.directory)
    if (found) {
      versions[wrapper] = found.version
      const engineFound = engine && findPackage(engine, found.directory)
      if (engineFound) {
        versions[engine] = engineFound.version
      }
    }
  }
  return versions
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
  const jpegQuality = gulpConfig.get('images.jpegQuality')
  // Left unset, imagemin runs its default plugins with their own defaults
  const plugins = jpegQuality ? imageminPlugins(jpegQuality) : undefined
  const options = {
    interlaced: true,
    silent: true,
    verbose: false,
  }
  // Gulp 5 reads files as utf8 text unless told otherwise, which corrupts binary images.
  return src(imageSrc, { encoding: false })
    .pipe(
      // Only images imagemin hasn't optimized before go through it; the rest come from the cache
      cacheFiles(
        imagemin(plugins, options),
        {
          directory: gulpConfig.get('images.cacheDir'),
          // Each quality gets results of its own
          name: jpegQuality ? `jpeg-quality-${jpegQuality}` : 'default',
          // A new imagemin (or plugin, or engine) version, or other options, makes new results
          fingerprint: JSON.stringify({ options, versions: imageminVersions() })
        }
      )
    )
    .pipe(dest(imageDest))
}
