'use strict'

const gulpConfig = require('../gulp.config.js')
const {
  runCLI: jest
} = require('jest')
let testPath = gulpConfig.get('testPath')
if (!Array.isArray(testPath)) {
  // The testPath must be an array of strings
  testPath = [testPath]
}

/**
 * Run the Jest tests for files which have been modified (based on git status).
 * @function
 * @memberOf module:js-build-tools
 * @returns {Promise<*>}
 */
const testQuick = async () => await jest({
  onlyChanged: true
}, testPath)
module.exports = testQuick
