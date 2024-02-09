const { dest, src } = require('gulp')

/**
 * Copy some files to a different location.
 * @memberOf module:partials
 * @param {string|array} srcPath
 * @param {string} destPath
 * @returns {stream.Stream}
 */
const copyFor = (srcPath, destPath) => src(srcPath)
  .pipe(dest(destPath))

module.exports = copyFor
