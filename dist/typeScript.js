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
 * @returns {readable-stream.Stream}
 * @see `https://www.typescriptlang.org/docs/handbook/gulp.html` for more info
 */
var typeScript = function typeScript () {
  return src(gulpConfig.get('tsSearch')).pipe(tsProject()).js.pipe(dest(gulpConfig.get('distPath')))
}
module.exports = typeScript
