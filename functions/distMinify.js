const { dest, src } = require('gulp')
const gulpConfig = require('../gulp.config.js')
const { default: uglify } = require('gulp-uglify-es')
const rename = require('gulp-rename')

/**
 * Creates minified versions of the dist files.
 * @returns {*}
 */
const distMinify = () => src(gulpConfig.get('distSearch'))
  .pipe(uglify())
  .pipe(rename({ extname: '.min.js' }))
  .pipe(dest(gulpConfig.get('distPath')))

module.exports = distMinify
