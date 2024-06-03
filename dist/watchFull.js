'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.watchFull = void 0
var _partials = require('./partials.js')
/**
 * Watch for changes and run the distribution for the changed files, then bundle and test the changed files.
 * @memberOf module:js-build-tools
 * @returns {FSWatcher}
 */
const watchFull = () => (0, _partials.beginWatcher)().on('change', _partials.runOnChange)
exports.watchFull = watchFull
