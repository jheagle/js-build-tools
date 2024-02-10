const { dest, src } = require('gulp')
const gulpConfig = require('../gulp.config.js')
const standard = require('gulp-standard')

/**
 * Applies Standard code style linting to bundled file.
 * @memberOf module:js-build-tools
 * @returns {stream.Stream}
 */
const bundleLint = () => src(`${gulpConfig.get('browser.to')}/${gulpConfig.get('browser.name')}.js`)
  .pipe(standard({ fix: true }))
  .pipe(standard.reporter('default', {
    fix: true,
    quiet: true
  }))
  .pipe(dest(gulpConfig.get('browser.to')))

module.exports = bundleLint
