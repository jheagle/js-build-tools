'use strict'

var gulpConfig = require('../gulp.config.js')

var _require = require('gulp')
var series = _require.series
var watch = _require.watch

var testQuick = require('./testQuick')
/**
 * Watch for changes and run the tests.
 * @returns {*}
 */

var watchTest = function watchTest () {
  return watch(gulpConfig.watchSearch, {
    ignoreInitial: false
  }, series(testQuick))
}

module.exports = watchTest