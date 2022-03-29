const { dest, src } = require('gulp')
const gulpConfig = require('../gulp.config.js')
const rename = require('gulp-rename')

module.exports = () => src(gulpConfig.readmeTemplate)
  .pipe(rename('README.md'))
  .pipe(dest('.'))
