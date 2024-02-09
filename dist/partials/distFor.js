"use strict";

const babel = require('gulp-babel');
const {
  dest,
  src
} = require('gulp');
const distForSrc = require('./distForSrc');
const gulpConfig = require('../../gulp.config.js');

/**
 * Build the distribution for a given source pattern.
 * @memberOf module:partials
 * @param {string|array} [srcPath='src/config/path/dist/for']
 * @param {string} [destPath='dist/config/path']
 * @returns {stream.Stream}
 */
const distFor = function () {
  let srcPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : distForSrc();
  let destPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : gulpConfig.get('distPath');
  return src(srcPath).pipe(babel()).pipe(dest(destPath));
};
module.exports = distFor;