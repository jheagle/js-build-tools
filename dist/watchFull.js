'use strict'

require('core-js/modules/es.regexp.constructor.js')
require('core-js/modules/es.regexp.exec.js')
require('core-js/modules/es.regexp.sticky.js')
require('core-js/modules/es.regexp.to-string.js')
require('core-js/modules/es.string.replace.js')
var bundle = require('./bundle')
var distFor = require('./distFor')
var tsFor = require('./tsFor')
var gulpConfig = require('../gulp.config.js')
var _require = require('gulp')
var parallel = _require.parallel
var series = _require.series
var watch = _require.watch
var testQuick = require('./testQuick')

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
var watchFull = function watchFull () {
  return watch(gulpConfig.get('watchSearch')).on('change', function (path) {
    var useTs = gulpConfig.get('useTsConfig')
    var distPath = gulpConfig.get('distPath')
    var srcPath = gulpConfig.get('srcPath')
    /**
     * 1. The original path comes in from src and is a .ts
     * 2. Discover the outgoing dist path where that file should go
     * 3. Use the path and dist in tsFor
     * 4. Take the original path, convert to full file path in dist
     * 5. Use the dist path found previously in #2
     * 6. Use the full dist path and the dist outgoing path in distFor
     */
    var pathRegex = new RegExp('^'.concat(srcPath, '(.*\\/)(.+)\\.(js|ts)$'), 'i')
    var distPathResult = path.replace(pathRegex, ''.concat(distPath, '$1'))
    var distSrcPath = path
    if (useTs) {
      distSrcPath = path.replace(pathRegex, ''.concat(distPath, '$1$2.js'))
    }
    var distForPath = function distForPath () {
      return distFor(distSrcPath, distPathResult)
    }
    var distSeries = function distSeries () {
      return useTs ? series(function () {
        return tsFor(path, distPathResult)
      }, distForPath) : distForPath
    }
    return gulpConfig.get('nodeOnly') ? parallel(testQuick, distSeries)() : parallel(testQuick, series(distSeries, bundle))()
  })
}
module.exports = watchFull
