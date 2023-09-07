'use strict'

var gulpConfig = require('../gulp.config.js')
var _require = require('jest')
var runCLI = _require.runCLI

/**
 * Run the Jest tests for files which have been modified (based on git status).
 * Configure where tests are located by using 'testPath'.
 * @function
 * @memberOf module:js-build-tools
 * @returns {Promise<*>}
 */
var testQuick = function testQuick () {
  var testPath = gulpConfig.get('testPath')
  if (!Array.isArray(testPath)) {
    // The testPath must be an array of strings
    testPath = [testPath]
  }
  return runCLI({
    onlyChanged: true
  }, testPath)
}
module.exports = testQuick
