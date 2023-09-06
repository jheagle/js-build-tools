'use strict'

var _require = require('./partials')
var beginWatcher = _require.beginWatcher
var runOnChange = _require.runOnChange

/**
 * Watch for changes and run the distribution for the changed files, then bundle and test the changed files.
 * @function
 * @memberOf module:js-build-tools
 * @returns {FSWatcher}
 */
var watchFull = function watchFull () {
  return beginWatcher().on('change', runOnChange)
}
module.exports = watchFull
