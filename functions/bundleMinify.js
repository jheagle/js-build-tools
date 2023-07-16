const { dest, src } = require('gulp')
const gulpConfig = require('../gulp.config.js')
const { default: uglify } = require('gulp-uglify-es')
const rename = require('gulp-rename')

/**
 * Creates the minified bundle file.
 * @returns {*}
 */
const bundleMinify = () => src(`${gulpConfig.get('browserPath')}/${gulpConfig.get('browserName')}.js`)
  .pipe(uglify())
  .pipe(rename({ extname: '.min.js' }))
  .pipe(dest(gulpConfig.get('browserPath')))

module.exports = bundleMinify
