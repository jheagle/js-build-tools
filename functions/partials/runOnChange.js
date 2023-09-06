const gulpConfig = require('../../gulp.config.js')
const bundle = require('../bundle')
const distSeries = require('./distSeries')
const { parallel, series } = require('gulp')
const testQuick = require('../testQuick')

/**
 * Run this function when the watched files are modified.
 * 1. Find the sub-folders within src path
 * 2. Maintain the folders, but use distPath for base
 * 3. Remove base folder and return dist path with correct sub-folders
 * @example
 * // Configured paths
 * distPath = 'dist'
 * srcPath = 'functions'
 *
 * // Path parameter
 * path = 'functions/some/path/file.js'
 *
 * // Generated regex using configured srcPath
 * pathRegex = '/^functions(.*\/).+\.js$/i'
 *
 * // Replace value using the configured distPath
 * replacePath = 'dist$1'
 *
 * // The resulting replaced path for the destination folder
 * distPathResult = 'dist/some/path/'
 * @function
 * @memberOf module:partials
 * @param {string} path
 * @returns {stream.Stream}
 */
const runOnChange = path => {
  const useTs = gulpConfig.get('useTsConfig')
  const distPath = gulpConfig.get('distPath')
  const srcPath = gulpConfig.get('srcPath')
  /**
   * 1. The original path comes in from src and is a .ts
   * 2. Discover the outgoing dist path where that file should go
   * 3. Use the path and dist in tsFor
   * 4. Take the original path, convert to full file path in dist
   * 5. Use the dist path found previously in #2
   * 6. Use the full dist path and the dist outgoing path in distFor
   */
  const pathRegex = new RegExp(`^${srcPath}(.*\\/)(.+)\\.(js|ts)$`, 'i')
  const distPathResult = path.replace(pathRegex, `${distPath}$1`)
  let distSrcPath = path
  if (useTs) {
    distSrcPath = path.replace(pathRegex, `${distPath}$1$2.js`)
  }
  const runSeries = distSeries(distSrcPath, distPathResult, path)
  return gulpConfig.get('nodeOnly')
    ? series(testQuick, runSeries)()
    : parallel(testQuick, series(runSeries, bundle))()
}

module.exports = runOnChange
