const gulpConfig = require('../gulp.config.js')
const { runCLI } = require('jest')

/**
 * Run the Jest tests for files which have been modified (based on git status).
 * Configure where tests are located by using 'testPath'.
 * @memberOf module:js-build-tools
 * @returns {Promise<*>}
 */
const testQuick = () => {
  let testPath = gulpConfig.get('test.path')
  if (!Array.isArray(testPath)) {
    // The testPath must be an array of strings
    testPath = [testPath]
  }
  return runCLI({ onlyChanged: true }, testPath)
}

module.exports = testQuick
