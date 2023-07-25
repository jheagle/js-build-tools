const gulpConfig = require('../gulp.config.js')
const { dest, src } = require('gulp')
const standard = require('gulp-standard')

/**
 * Applies Standard code style linting to distribution files.
 * @function
 * @memberOf module:js-build-tools
 * @returns {*}
 */
const distLint = () => src(gulpConfig.get('distSearch'))
  .pipe(standard({ fix: true }))
  .pipe(standard.reporter('default', {
    fix: true,
    quiet: true
  }))
  .pipe(dest(gulpConfig.get('distPath')))

module.exports = distLint
