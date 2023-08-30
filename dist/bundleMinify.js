'use strict'

require('core-js/modules/es.array.concat.js')
var gulpConfig = require('../gulp.config.js')
var minifyFor = require('./partials/minifyFor')

/**
 * Creates the minified bundle file.
 * @function
 * @memberOf module:js-build-tools
 * @returns {*}
 */
var bundleMinify = function bundleMinify () {
  return minifyFor(''.concat(gulpConfig.get('browserPath'), '/').concat(gulpConfig.get('browserName'), '.js'), gulpConfig.get('browserPath'))
}
module.exports = bundleMinify
