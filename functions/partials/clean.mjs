import * as gulpConfig from '../../gulp.config.mjs'
import { removeDirectory } from './removeDirectory.mjs'

/**
 * Deletes all the distribution and browser files (used before create a new build).
 * Configure array of directories to remove with 'cleanPaths'.
 * @memberOf module:partials
 * @returns {Promise<string[]> | *}
 */
export const clean = () => gulpConfig.get('cleanPaths').reduce(
  (promise, path) => promise.then(() => removeDirectory(path)),
  Promise.resolve()
)
