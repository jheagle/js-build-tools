"use strict";

var _require = require('gulp'),
  dest = _require.dest,
  src = _require.src;
var _require2 = require('gulp-uglify-es'),
  uglify = _require2.default;
var rename = require('gulp-rename');

/**
 * Minify files and rename the output with '.min' extension.
 * @function
 * @memberOf module:partials
 * @returns {*}
 */
var minifyFor = function minifyFor(srcSearch, destination) {
  return src(srcSearch).pipe(uglify()).pipe(rename({
    extname: '.min.js'
  })).pipe(dest(destination));
};
module.exports = minifyFor;