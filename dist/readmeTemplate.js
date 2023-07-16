'use strict'

var _require = require('gulp')
var dest = _require.dest
var src = _require.src
var gulpConfig = require('../gulp.config.js')
var rename = require('gulp-rename')

/**
 * Copy a readme template into the README.md file.
 * @returns {*}
 */
var readmeTemplate = function readmeTemplate () {
  return src(gulpConfig.get('readmeTemplate')).pipe(rename('README.md')).pipe(dest('.'))
}
module.exports = readmeTemplate
