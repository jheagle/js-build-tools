'use strict'

var dist = require('./dist')
var bundle = require('./bundle')
var gulpConfig = require('../gulp.config')
var _require = require('gulp')
var series = _require.series

/**
 * Recommended as the default task, runs the simple dist and bundle tasks.
 * @memberOf module:js-build-tools
 * @param {function} [done=null]
 * @returns {stream.Stream}
 */
var defaultCmd = function defaultCmd () {
  var done = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null
  return gulpConfig.get('nodeOnly') ? series(dist)(done) : series(dist, bundle)(done)
}
module.exports = defaultCmd
