const babel = require('gulp-babel')
const { dest, src } = require('gulp')
const gulpConfig = require('../gulp.config.js')

/**
 * Build the distribution for a given source pattern.
 * @param {string|array} srcPath
 * @param {string} destPath
 * @returns {*}
 */
const distFor = (srcPath = gulpConfig.srcSearch, destPath = gulpConfig.distPath) => src(srcPath)
  .pipe(babel())
  .pipe(dest(destPath))

module.exports = distFor
