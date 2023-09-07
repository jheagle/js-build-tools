'use strict'

var gulpConfig = require('../gulp.config.js')
var _require = require('jest')
var runCLI = _require.runCLI

/**
 * Run all tests with jest.
 * Configure where tests are located by using 'testPath'.
 * @function
 * @memberOf module:js-build-tools
 * @returns {Promise<*>}
 */
var testFull = function testFull () {
  var testPath = gulpConfig.get('testPath')
  if (!Array.isArray(testPath)) {
    // The testPath must be an array of strings
    testPath = [testPath]
  }
  return runCLI(gulpConfig.get('testOptions'), testPath)
}
module.exports = testFull
