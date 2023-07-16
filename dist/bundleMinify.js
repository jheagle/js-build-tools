'use strict'

require('core-js/modules/es.array.concat.js')
var _require = require('gulp')
var dest = _require.dest
var src = _require.src
var gulpConfig = require('../gulp.config.js')
var _require2 = require('gulp-uglify-es')
var uglify = _require2.default
var rename = require('gulp-rename')

/**
 * Creates the minified bundle file.
 * @returns {*}
 */
var bundleMinify = function bundleMinify () {
  return src(''.concat(gulpConfig.get('browserPath'), '/').concat(gulpConfig.get('browserName'), '.js')).pipe(uglify()).pipe(rename({
    extname: '.min.js'
  })).pipe(dest(gulpConfig.get('browserPath')))
}
module.exports = bundleMinify
