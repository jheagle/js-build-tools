'use strict'

var _require = require('gulp')
var dest = _require.dest
var src = _require.src
var gulpConfig = require('../gulp.config.js')
var _require2 = require('gulp-uglify-es')
var uglify = _require2.default
var rename = require('gulp-rename')

/**
 * Creates minified versions of the dist files.
 * @returns {*}
 */
var distMinify = function distMinify () {
  return src(gulpConfig.get('distSearch')).pipe(uglify()).pipe(rename({
    extname: '.min.js'
  })).pipe(dest(gulpConfig.get('distPath')))
}
module.exports = distMinify
