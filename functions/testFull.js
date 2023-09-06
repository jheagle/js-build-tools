const gulpConfig = require('../gulp.config.js')
const { runCLI } = require('jest')

/**
 * Run all tests with jest.
 * @function
 * @memberOf module:js-build-tools
 * @param {function} [done=null]
 * @param {Array.<string>|string} [testPath='path/config/test/files']
 * @returns {Promise<*>}
 */
const testFull = (done = null, testPath = gulpConfig.get('testPath')) => {
  if (!Array.isArray(testPath)) {
    // The testPath must be an array of strings
    testPath = [testPath]
  }
  return runCLI(gulpConfig.get('testOptions'), testPath)
}

module.exports = testFull
