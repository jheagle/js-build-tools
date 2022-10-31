'use strict'

var gulpConfig = require('../gulp.config.js')
var _require = require('gulp')
var dest = _require.dest
var src = _require.src
var standard = require('gulp-standard')

/**
 * Applies Standard code style linting to distribution files.
 * @returns {*}
 */
var distLint = function distLint () {
  return src(gulpConfig.distSearch).pipe(standard({
    fix: true
  })).pipe(standard.reporter('default', {
    fix: true,
    quiet: true
  })).pipe(dest(gulpConfig.distPath))
}
module.exports = distLint
