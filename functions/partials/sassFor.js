const { dest, src } = require('gulp')
const gulpConfig = require('../../gulp.config.js')
const cssnano = require('gulp-cssnano')
const rename = require('gulp-rename')
const sass = require('gulp-sass')(require('sass'))

/**
 * Build the CSS for a given source pattern.
 * @memberOf module:partials
 * @param {string|array} [srcSearch='src/config/path/sass/for']
 * @param {string} [cssPath='css/config/path']
 * @returns {stream.Stream}
 */
const sassFor = (srcSearch = gulpConfig.get('sass.from'), cssPath = gulpConfig.get('sass.to')) => src(srcSearch)
  .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
  .pipe(dest(cssPath))
  .pipe(cssnano())
  .pipe(rename({ extname: '.min.css' }))
  .pipe(dest(cssPath))

module.exports = sassFor
