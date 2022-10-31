'use strict'

require('core-js/modules/es.regexp.constructor.js')
require('core-js/modules/es.regexp.exec.js')
require('core-js/modules/es.regexp.sticky.js')
require('core-js/modules/es.regexp.to-string.js')
require('core-js/modules/es.string.replace.js')
var bundle = require('./bundle')
var distFor = require('./distFor')
var gulpConfig = require('../gulp.config.js')
var _require = require('gulp')
var parallel = _require.parallel
var series = _require.series
var watch = _require.watch
var testQuick = require('./testQuick')

/**
 * Watch for changes and run the distribution for the changed files, then bundle and test the changed files.
 * @returns {*}
 */
var watchFull = function watchFull () {
  return watch(gulpConfig.watchSearch).on('change', function (path) {
    var pathRegex = new RegExp('^'.concat(gulpConfig.srcPath, '(.*\\/).+\\.js$'), 'i')
    var distForPath = function distForPath () {
      return distFor(path, path.replace(pathRegex, ''.concat(gulpConfig.distPath, '$1')))
    }
    return parallel(testQuick, series(distForPath, bundle))()
  })
}
module.exports = watchFull
