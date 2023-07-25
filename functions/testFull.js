const gulpConfig = require('../gulp.config.js')
const { runCLI: jest } = require('jest')

let testPath = gulpConfig.get('testPath')
if (!Array.isArray(testPath)) {
  // The testPath must be an array of strings
  testPath = [testPath]
}

/**
 * Run all tests with jest.
 * @function
 * @memberOf module:js-build-tools
 * @returns {Promise<*>}
 */
const testFull = async () => await jest(gulpConfig.get('testOptions'), testPath)

module.exports = testFull
