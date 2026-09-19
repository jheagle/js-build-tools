import { dest, src } from 'gulp'

/**
 * Copy some files to a different location.
 * @memberOf module:partials
 * @param {string|array} srcPath
 * @param {string} destPath
 * @returns {stream.Stream}
 */
// encoding: false copies the bytes untouched - Gulp 5's default utf8 handling corrupts binary files such as fonts.
export const copyFor = (srcPath, destPath) => src(srcPath, { encoding: false })
  .pipe(dest(destPath))
