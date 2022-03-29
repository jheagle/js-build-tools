const { dest, src } = require('gulp')
const gulpConfig = require('../gulp.config.js')
const { default: uglify } = require('gulp-uglify-es')
const rename = require('gulp-rename')

module.exports = () => src(gulpConfig.distSearch)
  .pipe(uglify())
  .pipe(rename({ extname: '.min.js' }))
  .pipe(dest(gulpConfig.distPath))
