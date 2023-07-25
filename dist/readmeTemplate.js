'use strict'

var _require = require('gulp')
var dest = _require.dest
var src = _require.src
var gulpConfig = require('../gulp.config.js')
var rename = require('gulp-rename')

/**
 * Copy a readme template into the README.md file.
 * @function
 * @memberOf module:js-build-tools
 * @returns {*}
 */
var readmeTemplate = function readmeTemplate () {
  return src(gulpConfig.get('readmeTemplate')).pipe(rename(gulpConfig.get('readmeFile'))).pipe(dest(gulpConfig.get('readmePath')))
}
module.exports = readmeTemplate
