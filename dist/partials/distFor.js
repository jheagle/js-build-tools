"use strict";

var babel = require('gulp-babel');
var _require = require('gulp'),
  dest = _require.dest,
  src = _require.src;
var distForSrc = require('./distForSrc');
var gulpConfig = require('../../gulp.config.js');

/**
 * Build the distribution for a given source pattern.
 * @function
 * @memberOf module:partials
 * @param {string|array} [srcPath='src/config/path/dist/for']
 * @param {string} [destPath='dist/config/path']
 * @returns {stream.Stream}
 */
var distFor = function distFor() {
  var srcPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : distForSrc();
  var destPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : gulpConfig.get('distPath');
  return src(srcPath).pipe(babel()).pipe(dest(destPath));
};
module.exports = distFor;