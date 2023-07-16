const { dest, src } = require('gulp')
const gulpConfig = require('../gulp.config.js')
const standard = require('gulp-standard')

/**
 * Applies Standard code style linting to bundled file.
 * @returns {*}
 */
const bundleLint = () => src(`${gulpConfig.get('browserPath')}/${gulpConfig.get('browserName')}.js`)
  .pipe(standard({ fix: true }))
  .pipe(standard.reporter('default', {
    fix: true,
    quiet: true
  }))
  .pipe(dest(gulpConfig.get('browserPath')))

module.exports = bundleLint
