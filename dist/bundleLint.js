'use strict'

require('core-js/modules/es.array.concat.js')
var _require = require('gulp')
var dest = _require.dest
var src = _require.src
var gulpConfig = require('../gulp.config.js')
var standard = require('gulp-standard')

/**
 * Applies Standard code style linting to bundled file.
 * @returns {*}
 */
var bundleLint = function bundleLint () {
  return src(''.concat(gulpConfig.browserPath, '/').concat(gulpConfig.browserName, '.js')).pipe(standard({
    fix: true
  })).pipe(standard.reporter('default', {
    fix: true,
    quiet: true
  })).pipe(dest(gulpConfig.browserPath))
}
module.exports = bundleLint
