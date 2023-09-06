'use strict'

var gulpConfig = require('../gulp.config.js')
var _require = require('jest')
var runCLI = _require.runCLI

/**
 * Run all tests with jest.
 * @function
 * @memberOf module:js-build-tools
 * @param {function} [done=null]
 * @param {Array.<string>|string} [testPath='path/config/test/files']
 * @returns {Promise<*>}
 */
var testFull = function testFull () {
  var done = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null
  var testPath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : gulpConfig.get('testPath')
  if (!Array.isArray(testPath)) {
    // The testPath must be an array of strings
    testPath = [testPath]
  }
  return runCLI(gulpConfig.get('testOptions'), testPath)
}
module.exports = testFull
