import { dest, src } from 'gulp'

/**
 * Copy some files to a different location.
 * @memberOf module:partials
 * @param {string|array} srcPath
 * @param {string} destPath
 * @returns {stream.Stream}
 */
export const copyFor = (srcPath, destPath) => src(srcPath)
  .pipe(dest(destPath))
