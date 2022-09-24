'use strict'

var babel = require('gulp-babel')

var _require = require('gulp')
var dest = _require.dest
var src = _require.src

var gulpConfig = require('../gulp.config.js')
/**
 * Build the distribution for a given source pattern.
 * @param {string|array} srcPath
 * @param {string} destPath
 * @returns {*}
 */

var distFor = function distFor () {
  var srcPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : gulpConfig.srcSearch
  var destPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : gulpConfig.distPath
  return src(srcPath).pipe(babel()).pipe(dest(destPath))
}

module.exports = distFor
