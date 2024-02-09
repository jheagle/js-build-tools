const { rm, exists } = require('fs')

/**
 * Return a promise to be completed once the specified directory is deleted.
 * @memberOf module:partials
 * @param {string} dirPath
 * @returns {Promise<*>}
 */
const removeDirectory = dirPath => new Promise(
  (resolve, reject) => exists(
    dirPath,
    doesExist => doesExist
      ? rm(
        dirPath,
        { recursive: true },
        error => error ? reject(error) : resolve(dirPath)
      )
      : resolve(dirPath)
  )
)

module.exports = removeDirectory
