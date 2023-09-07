const gulpConfig = require('../../gulp.config.js')
const removeDirectory = require('./removeDirectory')

/**
 * Deletes all the distribution and browser files (used before create a new build).
 * Configure array of directories to remove with 'cleanPaths'.
 * @function
 * @memberOf module:partials
 * @returns {Promise<string[]> | *}
 */
const clean = () => gulpConfig.get('cleanPaths').reduce(
    (promise, path) => promise.then(() => removeDirectory(path)),
    Promise.resolve()
  )

module.exports = clean
