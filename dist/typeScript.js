'use strict'

var _require = require('gulp')
var dest = _require.dest
var gulpConfig = require('../gulp.config.js')
var ts = require('gulp-typescript')
var tsProject = ts.createProject(gulpConfig.get('useTsConfig'))
/**
 * Starting at the source directory, find all the ts files and convert them into the distribution directory.
 * @function
 * @memberOf module:js-build-tools
 * @returns {*}
 */
var typeScript = function typeScript () {
  return tsProject.src().pipe(tsProject()).js.pipe(dest(gulpConfig.get('distPath')))
}
module.exports = typeScript

/**
 * @see https://www.typescriptlang.org/docs/handbook/gulp.html add ts plugin
 */
