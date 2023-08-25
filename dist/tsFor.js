'use strict'

var _require = require('gulp')
var dest = _require.dest
var src = _require.src
var gulpConfig = require('../gulp.config.js')
var ts = require('gulp-typescript')
var tsProject = ts.createProject(gulpConfig.get('useTsConfig'))

/**
 * Starting at the source directory, find all the ts files and convert them into the distribution directory.
 * @function
 * @memberOf module:js-build-tools
 * @param {string|array} [srcPath='']
 * @param {string} [distPath='']
 * @returns {stream.Stream}
 * @see `https://www.typescriptlang.org/docs/handbook/gulp.html` for more info
 */
var tsFor = function tsFor () {
  var srcPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : gulpConfig.get('tsSearch')
  var distPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : gulpConfig.get('distPath')
  return src(srcPath).pipe(tsProject()).js.pipe(dest(distPath))
}
module.exports = tsFor
