'use strict'

var _require = require('gulp')
var dest = _require.dest
var src = _require.src
var _require2 = require('gulp-uglify-es')
var uglify = _require2.default
var rename = require('gulp-rename')

/**
 * Minify files and rename the output with '.min' extension.
 * @function
 * @memberOf module:js-build-tools
 * @returns {*}
 */
var minifyFor = function minifyFor (srcSearch, destination) {
  return src(srcSearch).pipe(uglify()).pipe(rename({
    extname: '.min.js'
  })).pipe(dest(destination))
}
module.exports = minifyFor
