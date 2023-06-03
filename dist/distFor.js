'use strict'

const babel = require('gulp-babel')
const {
  dest,
  src
} = require('gulp')
const gulpConfig = require('../gulp.config.js')

/**
 * Build the distribution for a given source pattern.
 * @param {string|array} srcPath
 * @param {string} destPath
 * @returns {*}
 */
const distFor = function () {
  const srcPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : gulpConfig.srcSearch
  const destPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : gulpConfig.distPath
  return src(srcPath).pipe(babel()).pipe(dest(destPath))
}
module.exports = distFor
