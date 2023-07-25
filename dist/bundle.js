'use strict'

var browserify = require('browserify')
var _require = require('gulp')
var dest = _require.dest
var gulpConfig = require('../gulp.config.js')
var source = require('vinyl-source-stream')

/**
 * Starting at the distribution entry point, bundle all the files into a single file and store them in the specified output directory.
 * @function
 * @memberOf module:js-build-tools
 * @returns {*}
 */
var bundle = function bundle () {
  return browserify(gulpConfig.get('distMain')).bundle().pipe(source(''.concat(gulpConfig.get('browserName'), '.js'))).pipe(dest(gulpConfig.get('browserPath')))
}
module.exports = bundle
