const gulpConfig = require('../gulp.config.js')
const { runCLI: jest } = require('jest')

/**
 * Run the Jest tests for files which have been modified (based on git status).
 * @function
 * @memberOf module:js-build-tools
 * @returns {Promise<*>}
 */
const testQuick = async () => await jest({ onlyChanged: true }, gulpConfig.get('testPath'))

module.exports = testQuick
