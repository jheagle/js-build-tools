const { dest, src } = require('gulp')
const gulpConfig = require('../.gulp.config.js')
const standard = require('gulp-standard')

module.exports = () => src(`${gulpConfig.browserPath}/${gulpConfig.browserName}.js`)
  .pipe(standard({ fix: true }))
  .pipe(standard.reporter('default', {
    fix: true,
    quiet: true
  }))
  .pipe(dest(gulpConfig.browserPath))
