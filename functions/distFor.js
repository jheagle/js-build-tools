const babel = require('gulp-babel')
const { dest, src } = require('gulp')
const gulpConfig = require('../gulp.config.js')

/**
 * By default, with typescript the files will have been copied into dist already, otherwise use actual src.
 * @type {string|array}
 */
const defaultSrc = gulpConfig.get('useTsConfig')
  ? gulpConfig.get('distSearch')
  : gulpConfig.get('srcSearch')

/**
 * Build the distribution for a given source pattern.
 * @function
 * @memberOf module:js-build-tools
 * @param {string|array} srcPath
 * @param {string} destPath
 * @returns {*}
 */
const distFor = (srcPath = defaultSrc, destPath = gulpConfig.get('distPath')) => src(srcPath)
  .pipe(babel())
  .pipe(dest(destPath))

module.exports = distFor
