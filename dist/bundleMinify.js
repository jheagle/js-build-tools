'use strict'

require('core-js/modules/es.array.concat.js')
var gulpConfig = require('../gulp.config.js')
var minifyFor = require('./minifyFor')

/**
 * Creates the minified bundle file.
 * @returns {*}
 */
var bundleMinify = function bundleMinify () {
  return minifyFor(''.concat(gulpConfig.get('browserPath'), '/').concat(gulpConfig.get('browserName'), '.js'), gulpConfig.get('browserPath'))
}
module.exports = bundleMinify
