'use strict'

const gulpConfig = require('../gulp.config.js')
const {
  dest,
  src
} = require('gulp')
const standard = require('gulp-standard')

/**
 * Applies Standard code style linting to distribution files.
 * @memberOf module:js-build-tools
 * @returns {*}
 */
const distLint = () => src(gulpConfig.get('browser.from')).pipe(standard({
  fix: true
})).pipe(standard.reporter('default', {
  fix: true,
  quiet: true
})).pipe(dest(gulpConfig.get('dist.to')))
module.exports = distLint
