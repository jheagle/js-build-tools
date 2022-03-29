const gulpConfig = require('../.gulp.config.js');
const { dest, src } = require('gulp')
const standard = require('gulp-standard')

module.exports = () => src(gulpConfig.distSearch)
  .pipe(standard({ fix: true }))
  .pipe(standard.reporter('default', {
    fix: true,
    quiet: true
  }))
  .pipe(dest(gulpConfig.distPath))
