'use strict'

const {
  dest,
  src
} = require('gulp')
const gulpConfig = require('../gulp.config.js')
const standard = require('gulp-standard')

/**
 * Applies Standard code style linting to bundled file.
 * @function
 * @memberOf module:js-build-tools
 * @returns {*}
 */
const bundleLint = () => src(''.concat(gulpConfig.get('browserPath'), '/').concat(gulpConfig.get('browserName'), '.js')).pipe(standard({
  fix: true
})).pipe(standard.reporter('default', {
  fix: true,
  quiet: true
})).pipe(dest(gulpConfig.get('browserPath')))
module.exports = bundleLint
