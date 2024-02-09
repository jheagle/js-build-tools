"use strict";

const {
  dest,
  src
} = require('gulp');
const gulpConfig = require('../../gulp.config.js');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));

/**
 * Build the CSS for a given source pattern.
 * @memberOf module:partials
 * @param {string|array} [srcSearch='src/config/path/sass/for']
 * @param {string} [cssPath='css/config/path']
 * @returns {stream.Stream}
 */
const sassFor = function () {
  let srcSearch = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : gulpConfig.get('sassSearch');
  let cssPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : gulpConfig.get('cssPath');
  return src(srcSearch).pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
  .pipe(dest(cssPath)).pipe(cssnano()).pipe(rename({
    extname: '.min.css'
  })).pipe(dest(cssPath));
};
module.exports = sassFor;