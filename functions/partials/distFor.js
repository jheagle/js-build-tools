const babel = require('gulp-babel')
const { dest, src } = require('gulp')
const distForSrc = require('./distForSrc')
const gulpConfig = require('../../gulp.config.js')

/**
 * Build the distribution for a given source pattern.
 * @memberOf module:partials
 * @param {string|array} [srcPath='src/config/path/dist/for']
 * @param {string} [destPath='dist/config/path']
 * @returns {stream.Stream}
 */
const distFor = (srcPath = distForSrc(), destPath = gulpConfig.get('dist.to')) => src(srcPath)
  .pipe(babel())
  .pipe(dest(destPath))

module.exports = distFor
