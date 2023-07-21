'use strict'

var gulpConfig = require('../gulp.config.js')
var minifyFor = require('./minifyFor')

/**
 * Creates minified versions of the dist files.
 * @returns {*}
 */
var distMinify = function distMinify () {
  return minifyFor(gulpConfig.get('distSearch'), gulpConfig.get('distPath'))
}
module.exports = distMinify
