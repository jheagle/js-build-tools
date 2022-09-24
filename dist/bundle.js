'use strict'

var browserify = require('browserify')

var _require = require('gulp')
var dest = _require.dest

var gulpConfig = require('../gulp.config.js')

var source = require('vinyl-source-stream')
/**
 * Starting at the distribution entry point, bundle all the files into a single file and store them in the specified output directory.
 * @returns {*}
 */

var bundle = function bundle () {
  return browserify(gulpConfig.distMain).bundle().pipe(source(''.concat(gulpConfig.browserName, '.js'))).pipe(dest(gulpConfig.browserPath))
}

module.exports = bundle
