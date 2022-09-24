'use strict'

var del = require('del')

var gulpConfig = require('../gulp.config.js')
/**
 * Deletes all the distribution and browser files (used before create a new build).
 * @returns {Promise<string[]> | *}
 */

var clean = function clean () {
  return del([gulpConfig.distPath, gulpConfig.browserPath])
}

module.exports = clean
