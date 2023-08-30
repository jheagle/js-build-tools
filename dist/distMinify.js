'use strict'

var gulpConfig = require('../gulp.config.js')
var minifyFor = require('./partials/minifyFor')

/**
 * Creates minified versions of the dist files.
 * @function
 * @memberOf module:js-build-tools
 * @returns {*}
 */
var distMinify = function distMinify () {
  return minifyFor(gulpConfig.get('distSearch'), gulpConfig.get('distPath'))
}
module.exports = distMinify
