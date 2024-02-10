'use strict'

const gulpConfig = require('../gulp.config.js')
const {
  runCLI
} = require('jest')

/**
 * Run all tests with jest.
 * Configure where tests are located by using 'testPath'.
 * @memberOf module:js-build-tools
 * @returns {Promise<*>}
 */
const testFull = () => {
  let testPath = gulpConfig.get('test.path')
  if (!Array.isArray(testPath)) {
    // The testPath must be an array of strings
    testPath = [testPath]
  }
  return runCLI(gulpConfig.get('test.options'), testPath)
}
module.exports = testFull
