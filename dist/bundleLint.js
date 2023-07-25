'use strict'

require('core-js/modules/es.array.concat.js')
var _require = require('gulp')
var dest = _require.dest
var src = _require.src
var gulpConfig = require('../gulp.config.js')
var standard = require('gulp-standard')

/**
 * Applies Standard code style linting to bundled file.
 * @function
 * @memberOf module:js-build-tools
 * @returns {*}
 */
var bundleLint = function bundleLint () {
  return src(''.concat(gulpConfig.get('browserPath'), '/').concat(gulpConfig.get('browserName'), '.js')).pipe(standard({
    fix: true
  })).pipe(standard.reporter('default', {
    fix: true,
    quiet: true
  })).pipe(dest(gulpConfig.get('browserPath')))
}
module.exports = bundleLint
