'use strict'

var babel = require('gulp-babel')
var _require = require('gulp')
var dest = _require.dest
var src = _require.src
var gulpConfig = require('../gulp.config.js')

/**
 * By default, with typescript the files will have been copied into dist already, otherwise use actual src.
 * @type {string|array}
 */
var defaultSrc = gulpConfig.get('useTsConfig') ? gulpConfig.get('distSearch') : gulpConfig.get('srcSearch')

/**
 * Build the distribution for a given source pattern.
 * @function
 * @memberOf module:js-build-tools
 * @param {string|array} srcPath
 * @param {string} destPath
 * @returns {*}
 */
var distFor = function distFor () {
  var srcPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultSrc
  var destPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : gulpConfig.get('distPath')
  return src(srcPath).pipe(babel()).pipe(dest(destPath))
}
module.exports = distFor
