const gulpConfig = require('../gulp.config.js')
const { runCLI } = require('jest')

/**
 * Run the Jest tests for files which have been modified (based on git status).
 * @function
 * @memberOf module:js-build-tools
 * @param {function} [done=null]
 * @param {Array.<string>|string} [testPath='path/config/test/files']
 * @returns {Promise<*>}
 */
const testQuick = (done = null, testPath = gulpConfig.get('testPath')) => {
  if (!Array.isArray(testPath)) {
    // The testPath must be an array of strings
    testPath = [testPath]
  }
  return runCLI({ onlyChanged: true }, testPath)
}

module.exports = testQuick
