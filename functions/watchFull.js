const bundle = require('./bundle')
const distFor = require('./distFor')
const tsFor = require('./tsFor')
const gulpConfig = require('../gulp.config.js')
const { parallel, series, watch } = require('gulp')
const testQuick = require('./testQuick')

/**
 * Watch for changes and run the distribution for the changed files, then bundle and test the changed files.
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
 * @memberOf module:js-build-tools
 * @returns {*}
 */
const watchFull = () => watch(gulpConfig.get('watchSearch'))
  .on('change', path => {
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
    const distForPath = () => distFor(distSrcPath, distPathResult)
    const distSeries = () => useTs ? series(() => tsFor(path, distPathResult), distForPath) : distForPath
    return gulpConfig.get('nodeOnly')
      ? parallel(testQuick, distSeries)()
      : parallel(testQuick, series(distSeries, bundle))()
  })

module.exports = watchFull
